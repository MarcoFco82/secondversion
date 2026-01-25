import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminSocial.module.css';

// Platform presets with dimensions
const PLATFORMS = {
  linkedin_post: { name: 'LinkedIn Post', width: 1200, height: 1200, icon: 'in' },
  linkedin_article: { name: 'LinkedIn Article', width: 1200, height: 627, icon: 'in' },
  instagram_post: { name: 'Instagram Post', width: 1080, height: 1080, icon: 'ig' },
  instagram_story: { name: 'Instagram Story', width: 1080, height: 1920, icon: 'ig' },
  twitter: { name: 'Twitter/X', width: 1600, height: 900, icon: 'x' },
  behance: { name: 'Behance', width: 1400, height: 1050, icon: 'be' },
};

// Default color palettes
const DEFAULT_PALETTES = [
  { id: 'dark', name: 'Dark Mode', colors: ['#0a0a0a', '#1a1a1a', '#2a2a2a', '#ffa742', '#e8e8e8'] },
  { id: 'light', name: 'Light Mode', colors: ['#ffffff', '#f5f5f5', '#e8e8e8', '#ffa742', '#0a0a0a'] },
  { id: 'neon', name: 'Neon', colors: ['#0a0a0a', '#00ff88', '#ff00ff', '#00ffff', '#ffffff'] },
  { id: 'sunset', name: 'Sunset', colors: ['#1a0a1a', '#ff6b35', '#f7931e', '#ffd23f', '#ffffff'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0a1628', '#1e3a5f', '#3d5a80', '#98c1d9', '#e0fbfc'] },
];

// Frame/decoration styles
const FRAME_STYLES = [
  { id: 'none', name: 'None' },
  { id: 'corners', name: 'Tech Corners' },
  { id: 'border', name: 'Border' },
  { id: 'gradient_border', name: 'Gradient Border' },
  { id: 'scan_lines', name: 'Scan Lines' },
  { id: 'grid', name: 'Grid Overlay' },
  { id: 'circuit', name: 'Circuit Pattern' },
];

// Text alignment options
const TEXT_ALIGNS = ['left', 'center', 'right'];

// Font options
const FONTS = [
  { id: 'jetbrains', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace" },
  { id: 'space', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif" },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'righteous', name: 'Righteous', family: "'Righteous', cursive" },
];

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

export default function AdminSocial() {
  // Canvas refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Data states
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected source
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  // Platform & canvas
  const [platform, setPlatform] = useState('linkedin_post');
  const [canvasScale, setCanvasScale] = useState(0.4);

  // Design settings
  const [design, setDesign] = useState({
    backgroundColor: '#0a0a0a',
    backgroundGradient: false,
    gradientColor1: '#0a0a0a',
    gradientColor2: '#1a1a1a',
    gradientAngle: 135,
    frameStyle: 'corners',
    frameColor: '#ffa742',
    frameOpacity: 100,
  });

  // Text content
  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [textSettings, setTextSettings] = useState({
    headlineFont: 'jetbrains',
    headlineSize: 48,
    headlineColor: '#ffffff',
    headlineAlign: 'center',
    headlineY: 40,
    subtextFont: 'jetbrains',
    subtextSize: 24,
    subtextColor: '#888888',
    subtextAlign: 'center',
    subtextY: 60,
  });

  // Saved palettes
  const [savedPalettes, setSavedPalettes] = useState(DEFAULT_PALETTES);
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [newPaletteColors, setNewPaletteColors] = useState(['#000000', '#333333', '#666666', '#ffa742', '#ffffff']);

  // Export state
  const [exporting, setExporting] = useState(false);

  // Load projects and logs
  useEffect(() => {
    fetchData();
    loadSavedPalettes();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, logsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/logs'),
      ]);
      const projectsData = await projectsRes.json();
      const logsData = await logsRes.json();
      
      setProjects(projectsData.data || []);
      setLogs(logsData.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const loadSavedPalettes = () => {
    const saved = localStorage.getItem('social_palettes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedPalettes([...DEFAULT_PALETTES, ...parsed]);
      } catch (e) {
        console.error('Error loading palettes:', e);
      }
    }
  };

  const savePalette = () => {
    if (!newPaletteName.trim()) return;
    
    const newPalette = {
      id: `custom_${Date.now()}`,
      name: newPaletteName,
      colors: newPaletteColors,
      custom: true,
    };

    const customPalettes = savedPalettes.filter(p => p.custom);
    const updatedCustom = [...customPalettes, newPalette];
    
    localStorage.setItem('social_palettes', JSON.stringify(updatedCustom));
    setSavedPalettes([...DEFAULT_PALETTES, ...updatedCustom]);
    setShowPaletteModal(false);
    setNewPaletteName('');
  };

  const deletePalette = (paletteId) => {
    const customPalettes = savedPalettes.filter(p => p.custom && p.id !== paletteId);
    localStorage.setItem('social_palettes', JSON.stringify(customPalettes));
    setSavedPalettes([...DEFAULT_PALETTES, ...customPalettes]);
  };

  const applyPalette = (palette) => {
    setDesign(prev => ({
      ...prev,
      backgroundColor: palette.colors[0],
      gradientColor1: palette.colors[0],
      gradientColor2: palette.colors[1],
      frameColor: palette.colors[3],
    }));
    setTextSettings(prev => ({
      ...prev,
      headlineColor: palette.colors[4],
      subtextColor: palette.colors[2],
    }));
  };

  // Load log content into editor
  const loadLogContent = (log) => {
    setSelectedLog(log);
    setHeadline(log.one_liner || '');
    setSubtext(log.challenge_abstract || '');
  };

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = PLATFORMS[platform];
    
    canvas.width = width;
    canvas.height = height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    if (design.backgroundGradient) {
      const angle = design.gradientAngle * Math.PI / 180;
      const x1 = width / 2 - Math.cos(angle) * width;
      const y1 = height / 2 - Math.sin(angle) * height;
      const x2 = width / 2 + Math.cos(angle) * width;
      const y2 = height / 2 + Math.sin(angle) * height;
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, design.gradientColor1);
      gradient.addColorStop(1, design.gradientColor2);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = design.backgroundColor;
    }
    ctx.fillRect(0, 0, width, height);

    // Frame decorations
    drawFrame(ctx, width, height);

    // Text
    drawText(ctx, width, height);

  }, [platform, design, headline, subtext, textSettings]);

  const drawFrame = (ctx, width, height) => {
    const frameColor = design.frameColor;
    const opacity = design.frameOpacity / 100;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = frameColor;
    ctx.fillStyle = frameColor;

    const margin = Math.min(width, height) * 0.05;
    const cornerSize = Math.min(width, height) * 0.08;

    switch (design.frameStyle) {
      case 'corners':
        ctx.lineWidth = 3;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(margin, margin + cornerSize);
        ctx.lineTo(margin, margin);
        ctx.lineTo(margin + cornerSize, margin);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(width - margin - cornerSize, margin);
        ctx.lineTo(width - margin, margin);
        ctx.lineTo(width - margin, margin + cornerSize);
        ctx.stroke();
        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(margin, height - margin - cornerSize);
        ctx.lineTo(margin, height - margin);
        ctx.lineTo(margin + cornerSize, height - margin);
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(width - margin - cornerSize, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.lineTo(width - margin, height - margin - cornerSize);
        ctx.stroke();
        break;

      case 'border':
        ctx.lineWidth = 4;
        ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
        break;

      case 'gradient_border':
        ctx.lineWidth = 6;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, frameColor);
        gradient.addColorStop(0.5, 'transparent');
        gradient.addColorStop(1, frameColor);
        ctx.strokeStyle = gradient;
        ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
        break;

      case 'scan_lines':
        ctx.globalAlpha = opacity * 0.1;
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 2);
        }
        break;

      case 'grid':
        ctx.globalAlpha = opacity * 0.1;
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        break;

      case 'circuit':
        ctx.lineWidth = 2;
        ctx.globalAlpha = opacity * 0.3;
        // Draw circuit-like pattern
        const circuitMargin = margin * 2;
        const nodeSize = 6;
        
        // Horizontal lines with nodes
        for (let i = 0; i < 3; i++) {
          const y = circuitMargin + (i * (height - circuitMargin * 2) / 2);
          ctx.beginPath();
          ctx.moveTo(circuitMargin, y);
          ctx.lineTo(width - circuitMargin, y);
          ctx.stroke();
          
          // Nodes
          for (let j = 0; j < 5; j++) {
            const x = circuitMargin + (j * (width - circuitMargin * 2) / 4);
            ctx.beginPath();
            ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
    }

    ctx.restore();
  };

  const drawText = (ctx, width, height) => {
    // Headline
    if (headline) {
      const font = FONTS.find(f => f.id === textSettings.headlineFont);
      ctx.font = `bold ${textSettings.headlineSize}px ${font?.family || 'monospace'}`;
      ctx.fillStyle = textSettings.headlineColor;
      ctx.textAlign = textSettings.headlineAlign;
      
      const x = textSettings.headlineAlign === 'center' ? width / 2 
              : textSettings.headlineAlign === 'right' ? width - 60 
              : 60;
      const y = height * (textSettings.headlineY / 100);
      
      // Word wrap
      const maxWidth = width - 120;
      const lines = wrapText(ctx, headline, maxWidth);
      const lineHeight = textSettings.headlineSize * 1.3;
      
      lines.forEach((line, i) => {
        ctx.fillText(line, x, y + (i * lineHeight));
      });
    }

    // Subtext
    if (subtext) {
      const font = FONTS.find(f => f.id === textSettings.subtextFont);
      ctx.font = `${textSettings.subtextSize}px ${font?.family || 'monospace'}`;
      ctx.fillStyle = textSettings.subtextColor;
      ctx.textAlign = textSettings.subtextAlign;
      
      const x = textSettings.subtextAlign === 'center' ? width / 2 
              : textSettings.subtextAlign === 'right' ? width - 60 
              : 60;
      const y = height * (textSettings.subtextY / 100);
      
      const maxWidth = width - 120;
      const lines = wrapText(ctx, subtext, maxWidth);
      const lineHeight = textSettings.subtextSize * 1.4;
      
      lines.forEach((line, i) => {
        ctx.fillText(line, x, y + (i * lineHeight));
      });
    }
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  // Redraw on changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Export image
  const exportImage = async (format = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setExporting(true);

    try {
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      
      const link = document.createElement('a');
      link.download = `social_${platform}_${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  // Update design field
  const updateDesign = (field, value) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };

  // Update text settings
  const updateTextSettings = (field, value) => {
    setTextSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminLayout title="Social Generator">
        <div className={styles.loading}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Social Generator | DevLog Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Righteous&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <AdminLayout title="Social Generator">
        <div className={styles.container}>
          {/* Left Panel - Controls */}
          <div className={styles.controlsPanel}>
            {/* Source Selection */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Source</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Project</label>
                <select
                  className={styles.select}
                  value={selectedProject?.id || ''}
                  onChange={(e) => {
                    const proj = projects.find(p => p.id === e.target.value);
                    setSelectedProject(proj || null);
                    setSelectedLog(null);
                  }}
                >
                  <option value="">Select project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.display_name_en || p.alias}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Dev Log</label>
                <select
                  className={styles.select}
                  value={selectedLog?.id || ''}
                  onChange={(e) => {
                    const log = logs.find(l => l.id === e.target.value);
                    if (log) loadLogContent(log);
                  }}
                >
                  <option value="">Select log...</option>
                  {logs
                    .filter(l => !selectedProject || l.project_id === selectedProject.id)
                    .map(l => (
                      <option key={l.id} value={l.id}>
                        [{l.entry_type?.toUpperCase()}] {l.one_liner?.substring(0, 40)}...
                      </option>
                    ))
                  }
                </select>
              </div>
            </section>

            {/* Platform Selection */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Platform</h3>
              <div className={styles.platformGrid}>
                {Object.entries(PLATFORMS).map(([key, p]) => (
                  <button
                    key={key}
                    className={`${styles.platformBtn} ${platform === key ? styles.active : ''}`}
                    onClick={() => setPlatform(key)}
                  >
                    <span className={styles.platformIcon}>{p.icon}</span>
                    <span className={styles.platformName}>{p.name}</span>
                    <span className={styles.platformSize}>{p.width}x{p.height}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Color Palettes */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Color Palettes</h3>
                <button 
                  className={styles.addPaletteBtn}
                  onClick={() => setShowPaletteModal(true)}
                >
                  + Save
                </button>
              </div>
              <div className={styles.palettesGrid}>
                {savedPalettes.map(palette => (
                  <div 
                    key={palette.id} 
                    className={styles.paletteCard}
                    onClick={() => applyPalette(palette)}
                  >
                    <div className={styles.paletteColors}>
                      {palette.colors.map((color, i) => (
                        <div 
                          key={i} 
                          className={styles.paletteColor}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className={styles.paletteName}>{palette.name}</span>
                    {palette.custom && (
                      <button 
                        className={styles.deletePaletteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePalette(palette.id);
                        }}
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Background */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Background</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={design.backgroundGradient}
                    onChange={(e) => updateDesign('backgroundGradient', e.target.checked)}
                  />
                  Use Gradient
                </label>
              </div>

              {design.backgroundGradient ? (
                <>
                  <div className={styles.colorRow}>
                    <div className={styles.colorInput}>
                      <input
                        type="color"
                        value={design.gradientColor1}
                        onChange={(e) => updateDesign('gradientColor1', e.target.value)}
                      />
                      <span>Color 1</span>
                    </div>
                    <div className={styles.colorInput}>
                      <input
                        type="color"
                        value={design.gradientColor2}
                        onChange={(e) => updateDesign('gradientColor2', e.target.value)}
                      />
                      <span>Color 2</span>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Angle: {design.gradientAngle}</label>
                    <input
                      type="range"
                      className={styles.range}
                      min="0"
                      max="360"
                      value={design.gradientAngle}
                      onChange={(e) => updateDesign('gradientAngle', parseInt(e.target.value))}
                    />
                  </div>
                </>
              ) : (
                <div className={styles.colorInput}>
                  <input
                    type="color"
                    value={design.backgroundColor}
                    onChange={(e) => updateDesign('backgroundColor', e.target.value)}
                  />
                  <span>{design.backgroundColor}</span>
                </div>
              )}
            </section>

            {/* Frame Style */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Frame Style</h3>
              
              <div className={styles.formGroup}>
                <select
                  className={styles.select}
                  value={design.frameStyle}
                  onChange={(e) => updateDesign('frameStyle', e.target.value)}
                >
                  {FRAME_STYLES.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {design.frameStyle !== 'none' && (
                <>
                  <div className={styles.colorInput}>
                    <input
                      type="color"
                      value={design.frameColor}
                      onChange={(e) => updateDesign('frameColor', e.target.value)}
                    />
                    <span>Frame Color</span>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Opacity: {design.frameOpacity}%</label>
                    <input
                      type="range"
                      className={styles.range}
                      min="0"
                      max="100"
                      value={design.frameOpacity}
                      onChange={(e) => updateDesign('frameOpacity', parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Center - Canvas Preview */}
          <div className={styles.canvasPanel}>
            <div className={styles.canvasHeader}>
              <span className={styles.canvasDimensions}>
                {PLATFORMS[platform].width} x {PLATFORMS[platform].height}
              </span>
              <div className={styles.zoomControls}>
                <button onClick={() => setCanvasScale(Math.max(0.2, canvasScale - 0.1))}>-</button>
                <span>{Math.round(canvasScale * 100)}%</span>
                <button onClick={() => setCanvasScale(Math.min(1, canvasScale + 0.1))}>+</button>
              </div>
            </div>
            
            <div 
              className={styles.canvasContainer} 
              ref={containerRef}
            >
              <canvas
                ref={canvasRef}
                className={styles.canvas}
                style={{
                  transform: `scale(${canvasScale})`,
                  transformOrigin: 'top center',
                }}
              />
            </div>

            <div className={styles.canvasFooter}>
              <button 
                className={styles.exportBtn}
                onClick={() => exportImage('png')}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'Download PNG'}
              </button>
              <button 
                className={styles.exportBtnSecondary}
                onClick={() => exportImage('jpg')}
                disabled={exporting}
              >
                Download JPG
              </button>
            </div>
          </div>

          {/* Right Panel - Text Controls */}
          <div className={styles.textPanel}>
            {/* Headline */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Headline</h3>
              
              <div className={styles.formGroup}>
                <textarea
                  className={styles.textarea}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Main headline text..."
                  rows={3}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Font</label>
                  <select
                    className={styles.select}
                    value={textSettings.headlineFont}
                    onChange={(e) => updateTextSettings('headlineFont', e.target.value)}
                  >
                    {FONTS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Size</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={textSettings.headlineSize}
                    onChange={(e) => updateTextSettings('headlineSize', parseInt(e.target.value))}
                    min={12}
                    max={200}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.colorInput}>
                  <input
                    type="color"
                    value={textSettings.headlineColor}
                    onChange={(e) => updateTextSettings('headlineColor', e.target.value)}
                  />
                  <span>Color</span>
                </div>
                <div className={styles.alignBtns}>
                  {TEXT_ALIGNS.map(align => (
                    <button
                      key={align}
                      className={`${styles.alignBtn} ${textSettings.headlineAlign === align ? styles.active : ''}`}
                      onClick={() => updateTextSettings('headlineAlign', align)}
                    >
                      {align === 'left' ? '◧' : align === 'center' ? '◫' : '◨'}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Vertical Position: {textSettings.headlineY}%</label>
                <input
                  type="range"
                  className={styles.range}
                  min="10"
                  max="90"
                  value={textSettings.headlineY}
                  onChange={(e) => updateTextSettings('headlineY', parseInt(e.target.value))}
                />
              </div>
            </section>

            {/* Subtext */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Subtext</h3>
              
              <div className={styles.formGroup}>
                <textarea
                  className={styles.textarea}
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  placeholder="Supporting text..."
                  rows={3}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Font</label>
                  <select
                    className={styles.select}
                    value={textSettings.subtextFont}
                    onChange={(e) => updateTextSettings('subtextFont', e.target.value)}
                  >
                    {FONTS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Size</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={textSettings.subtextSize}
                    onChange={(e) => updateTextSettings('subtextSize', parseInt(e.target.value))}
                    min={10}
                    max={100}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.colorInput}>
                  <input
                    type="color"
                    value={textSettings.subtextColor}
                    onChange={(e) => updateTextSettings('subtextColor', e.target.value)}
                  />
                  <span>Color</span>
                </div>
                <div className={styles.alignBtns}>
                  {TEXT_ALIGNS.map(align => (
                    <button
                      key={align}
                      className={`${styles.alignBtn} ${textSettings.subtextAlign === align ? styles.active : ''}`}
                      onClick={() => updateTextSettings('subtextAlign', align)}
                    >
                      {align === 'left' ? '◧' : align === 'center' ? '◫' : '◨'}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Vertical Position: {textSettings.subtextY}%</label>
                <input
                  type="range"
                  className={styles.range}
                  min="10"
                  max="90"
                  value={textSettings.subtextY}
                  onChange={(e) => updateTextSettings('subtextY', parseInt(e.target.value))}
                />
              </div>
            </section>

            {/* AI Suggestions (placeholder) */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>AI Suggestions</h3>
              <p className={styles.aiNote}>
                Select a dev log to generate AI-powered headline suggestions.
              </p>
              <button className={styles.aiBtn} disabled={!selectedLog}>
                Generate Headlines
              </button>
            </section>
          </div>
        </div>

        {/* Save Palette Modal */}
        {showPaletteModal && (
          <div className={styles.modalOverlay} onClick={() => setShowPaletteModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Save Color Palette</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Palette Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={newPaletteName}
                  onChange={(e) => setNewPaletteName(e.target.value)}
                  placeholder="My Palette"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Colors</label>
                <div className={styles.paletteEditor}>
                  {newPaletteColors.map((color, i) => (
                    <input
                      key={i}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...newPaletteColors];
                        newColors[i] = e.target.value;
                        setNewPaletteColors(newColors);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={styles.cancelBtn}
                  onClick={() => setShowPaletteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.saveBtn}
                  onClick={savePalette}
                >
                  Save Palette
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
