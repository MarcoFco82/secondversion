import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminSphere.module.css';

const DEFAULTS = {
  hexCount: 30,
  bloomThreshold: 0.6,
  bloomIntensity: 0.8,
  bloomSmoothing: 0.4,
  particleColor: '#38bdf8',
  particleSize: 0.008,
  particleOpacity: 0.6,
  strokeColor: '#38bdf8',
  strokeOpacity: 1.0,
  ghostSphereColor: '#38bdf8',
  ghostSphereOpacity: 0.06,
  inactiveFillOpacity: 0.02,
  activeEmissiveBase: 0.3,
  activeEmissiveHover: 0.8,
  activeEmissiveSelected: 2.0,
  bgGradientTop: '#0f1923',
  bgGradientBottom: '#0a0a0a',
};

export default function AdminSpherePage() {
  const [config, setConfig] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }

  // Load current config on mount
  useEffect(() => {
    fetch('/api/sphere-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig({ ...DEFAULTS, ...data.data });
        }
      })
      .catch(() => {});
  }, []);

  const updateField = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  };

  const handleReset = () => {
    setConfig({ ...DEFAULTS });
    setStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/sphere-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Configuration saved. Reload site to see changes.' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Failed to save' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const SliderField = ({ label, field, min, max, step }) => (
    <div className={styles.fieldRow}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.fieldControl}>
        <input
          type="range"
          className={styles.slider}
          min={min}
          max={max}
          step={step}
          value={config[field]}
          onChange={(e) => updateField(field, parseFloat(e.target.value))}
        />
        <span className={styles.sliderValue}>{config[field]}</span>
      </div>
    </div>
  );

  const ColorField = ({ label, field }) => (
    <div className={styles.colorField}>
      <span className={styles.colorLabel}>{label}:</span>
      <input
        type="color"
        className={styles.colorInput}
        value={config[field]}
        onChange={(e) => updateField(field, e.target.value)}
      />
      <span className={styles.colorHex}>{config[field]}</span>
    </div>
  );

  return (
    <AdminLayout title="Sphere Config">
      <div className={styles.container}>

        {/* GEOMETRY */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Geometry</h3>
          <SliderField label="Hex Count" field="hexCount" min={10} max={80} step={1} />
        </div>

        {/* BLOOM / GLOW */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Bloom / Glow</h3>
          <SliderField label="Threshold" field="bloomThreshold" min={0} max={2} step={0.05} />
          <SliderField label="Intensity" field="bloomIntensity" min={0} max={3} step={0.05} />
          <SliderField label="Smoothing" field="bloomSmoothing" min={0} max={1} step={0.05} />
        </div>

        {/* COLORS */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Colors</h3>
          <div className={styles.colorPickerRow}>
            <ColorField label="Particle" field="particleColor" />
            <ColorField label="Stroke" field="strokeColor" />
            <ColorField label="Ghost Sphere" field="ghostSphereColor" />
          </div>
        </div>

        {/* OPACITIES & SIZES */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Opacities & Sizes</h3>
          <SliderField label="Stroke Opacity" field="strokeOpacity" min={0} max={1} step={0.05} />
          <SliderField label="Ghost Opacity" field="ghostSphereOpacity" min={0} max={0.3} step={0.01} />
          <SliderField label="Inactive Fill" field="inactiveFillOpacity" min={0} max={0.2} step={0.005} />
          <SliderField label="Particle Opacity" field="particleOpacity" min={0} max={1} step={0.05} />
          <SliderField label="Particle Size" field="particleSize" min={0.002} max={0.03} step={0.001} />
        </div>

        {/* EMISSIVE (active faces) */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Emissive (Active Faces)</h3>
          <SliderField label="Base" field="activeEmissiveBase" min={0} max={2} step={0.05} />
          <SliderField label="Hover" field="activeEmissiveHover" min={0} max={3} step={0.05} />
          <SliderField label="Selected" field="activeEmissiveSelected" min={0} max={5} step={0.1} />
        </div>

        {/* BACKGROUND GRADIENT */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Background Gradient</h3>
          <div className={styles.colorPickerRow}>
            <ColorField label="Top" field="bgGradientTop" />
            <ColorField label="Bottom" field="bgGradientBottom" />
          </div>
          <div
            className={styles.gradientPreview}
            style={{
              background: `linear-gradient(180deg, ${config.bgGradientTop} 0%, ${config.bgGradientBottom} 100%)`,
            }}
          />
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset Defaults
          </button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        {/* STATUS */}
        {status && (
          <div className={`${styles.statusMsg} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
            {status.msg}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
