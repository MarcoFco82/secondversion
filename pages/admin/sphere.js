import { useState, useEffect, useRef, useCallback, memo } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminSphere.module.css';

const DEFAULTS = {
  hexCount: 30,
  bloomThreshold: 0.1,
  bloomIntensity: 1.5,
  bloomSmoothing: 0.5,
  particleColor: '#38bdf8',
  particleSize: 0.01,
  particleOpacity: 0.8,
  strokeColor: '#38bdf8',
  strokeOpacity: 1.0,
  ghostSphereColor: '#38bdf8',
  ghostSphereOpacity: 0.1,
  inactiveFillOpacity: 0.03,
  activeEmissiveBase: 0.5,
  activeEmissiveHover: 1.2,
  activeEmissiveSelected: 2.5,
  bgGradientTop: '#0f1923',
  bgGradientBottom: '#0a0a0a',
};

/**
 * Color picker that won't close on every change.
 *
 * Uses uncontrolled <input> (defaultValue) so React never touches
 * the DOM value and the native picker stays open while dragging.
 * Syncs to parent via native `change` event (fires when picker closes).
 */
const ColorPickerField = memo(function ColorPickerField({ label, field, value, onChangeComplete }) {
  const [hex, setHex] = useState(value);
  const inputRef = useRef(null);
  const callbackRef = useRef(onChangeComplete);
  callbackRef.current = onChangeComplete;

  // Sync from parent on reset
  useEffect(() => {
    setHex(value);
    if (inputRef.current) inputRef.current.value = value;
  }, [value]);

  // Native change event — fires ONCE when picker closes, not on every drag
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handler = (e) => {
      callbackRef.current(field, e.target.value);
    };
    el.addEventListener('change', handler);
    return () => el.removeEventListener('change', handler);
  }, [field]);

  return (
    <div className={styles.colorField}>
      <span className={styles.colorLabel}>{label}:</span>
      <input
        ref={inputRef}
        type="color"
        className={styles.colorInput}
        defaultValue={value}
        onInput={(e) => setHex(e.target.value)}
      />
      <span className={styles.colorHex}>{hex}</span>
    </div>
  );
}, (prev, next) => prev.value === next.value && prev.field === next.field);

export default function AdminSpherePage() {
  const [config, setConfig] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

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

  // Stable ref for color picker callback (avoids breaking memo)
  const updateFieldRef = useRef(updateField);
  updateFieldRef.current = updateField;
  const handleColorChange = useCallback((field, value) => {
    updateFieldRef.current(field, value);
  }, []);

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
            <ColorPickerField label="Particle" field="particleColor" value={config.particleColor} onChangeComplete={handleColorChange} />
            <ColorPickerField label="Stroke" field="strokeColor" value={config.strokeColor} onChangeComplete={handleColorChange} />
            <ColorPickerField label="Ghost Sphere" field="ghostSphereColor" value={config.ghostSphereColor} onChangeComplete={handleColorChange} />
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
            <ColorPickerField label="Top" field="bgGradientTop" value={config.bgGradientTop} onChangeComplete={handleColorChange} />
            <ColorPickerField label="Bottom" field="bgGradientBottom" value={config.bgGradientBottom} onChangeComplete={handleColorChange} />
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
