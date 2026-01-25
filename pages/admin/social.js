import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminSocial.module.css';

const PLATFORMS = {
  instagram_square: { name: 'Instagram Square', width: 1080, height: 1080, group: 'Instagram' },
  instagram_portrait: { name: 'Instagram Portrait', width: 1080, height: 1350, group: 'Instagram' },
  instagram_landscape: { name: 'Instagram Landscape', width: 1080, height: 566, group: 'Instagram' },
  instagram_story: { name: 'Instagram Story/Reel', width: 1080, height: 1920, group: 'Instagram' },
  facebook_landscape: { name: 'Facebook Landscape', width: 1200, height: 630, group: 'Facebook' },
  facebook_square: { name: 'Facebook Square', width: 1200, height: 1200, group: 'Facebook' },
  facebook_cover: { name: 'Facebook Cover', width: 820, height: 312, group: 'Facebook' },
  facebook_story: { name: 'Facebook Story', width: 1080, height: 1920, group: 'Facebook' },
  facebook_event: { name: 'Facebook Event', width: 1920, height: 1005, group: 'Facebook' },
  tiktok_video: { name: 'TikTok Video', width: 1080, height: 1920, group: 'TikTok' },
  youtube_thumbnail: { name: 'YouTube Thumbnail', width: 1280, height: 720, group: 'YouTube' },
  youtube_banner: { name: 'YouTube Banner', width: 2560, height: 1440, group: 'YouTube' },
  youtube_shorts: { name: 'YouTube Shorts', width: 1080, height: 1920, group: 'YouTube' },
  linkedin_landscape: { name: 'LinkedIn Landscape', width: 1200, height: 627, group: 'LinkedIn' },
  linkedin_square: { name: 'LinkedIn Square', width: 1200, height: 1200, group: 'LinkedIn' },
  linkedin_banner: { name: 'LinkedIn Banner', width: 1128, height: 191, group: 'LinkedIn' },
  x_landscape: { name: 'X Landscape', width: 1600, height: 900, group: 'X (Twitter)' },
  x_square: { name: 'X Square', width: 1080, height: 1080, group: 'X (Twitter)' },
  x_header: { name: 'X Header', width: 1500, height: 500, group: 'X (Twitter)' },
  whatsapp_status: { name: 'WhatsApp Status', width: 1080, height: 1920, group: 'WhatsApp' },
  pinterest_standard: { name: 'Pinterest Standard', width: 1000, height: 1500, group: 'Pinterest' },
  pinterest_square: { name: 'Pinterest Square', width: 1000, height: 1000, group: 'Pinterest' },
};

const PLATFORM_GROUPS = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'X (Twitter)', 'WhatsApp', 'Pinterest'];

const DEFAULT_PALETTES = [
  { id: 'dark', name: 'Dark Mode', colors: ['#0a0a0a', '#1a1a1a', '#2a2a2a', '#ffa742', '#e8e8e8'] },
  { id: 'light', name: 'Light Mode', colors: ['#ffffff', '#f5f5f5', '#e8e8e8', '#ffa742', '#0a0a0a'] },
  { id: 'neon', name: 'Neon', colors: ['#0a0a0a', '#00ff88', '#ff00ff', '#00ffff', '#ffffff'] },
  { id: 'sunset', name: 'Sunset', colors: ['#1a0a1a', '#ff6b35', '#f7931e', '#ffd23f', '#ffffff'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0a1628', '#1e3a5f', '#3d5a80', '#98c1d9', '#e0fbfc'] },
];

const FRAME_STYLES = [
  { id: 'none', name: 'None' },
  { id: 'corners', name: 'Tech Corners' },
  { id: 'border', name: 'Border' },
  { id: 'gradient_border', name: 'Gradient Border' },
  { id: 'scan_lines', name: 'Scan Lines' },
  { id: 'grid', name: 'Grid Overlay' },
  { id: 'circuit', name: 'Circuit Pattern' },
];

const BLEND_MODES = [
  { id: 'source-over', name: 'Normal' },
  { id: 'multiply', name: 'Multiply' },
  { id: 'screen', name: 'Screen' },
  { id: 'overlay', name: 'Overlay' },
  { id: 'soft-light', name: 'Soft Light' },
  { id: 'hard-light', name: 'Hard Light' },
  { id: 'difference', name: 'Difference' },
  { id: 'exclusion', name: 'Exclusion' },
];

const TEXT_ALIGNS = ['left', 'center', 'right'];

const FONTS = [
  { id: 'jetbrains', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace" },
  { id: 'space', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif" },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'righteous', name: 'Righteous', family: "'Righteous', cursive" },
];

const getAuthToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('admin_token');
  return null;
};

export default function AdminSocial() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [projectMedia, setProjectMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const [platform, setPlatform] = useState('linkedin_square');
  const [canvasScale, setCanvasScale] = useState(0.4);

  const [mediaAsset, setMediaAsset] = useState({
    enabled: false, url: '', image: null, size: 80, posX: 50, posY: 50,
  });

  const [textures, setTextures] = useState([]);
  const [availableTextures, setAvailableTextures] = useState([]);
  const [loadedTextureImages, setLoadedTextureImages] = useState({});

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

  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [extraText1, setExtraText1] = useState({ enabled: false, text: '' });
  const [extraText2, setExtraText2] = useState({ enabled: false, text: '' });

  const [textSettings, setTextSettings] = useState({
    headlineFont: 'jetbrains', headlineSize: 48, headlineColor: '#ffffff', headlineAlign: 'center', headlineY: 40,
    subtextFont: 'jetbrains', subtextSize: 24, subtextColor: '#888888', subtextAlign: 'center', subtextY: 60,
    extra1Font: 'jetbrains', extra1Size: 18, extra1Color: '#666666', extra1Align: 'center', extra1Y: 85,
    extra2Font: 'jetbrains', extra2Size: 16, extra2Color: '#555555', extra2Align: 'center', extra2Y: 92,
  });

  const [savedPalettes, setSavedPalettes] = useState(DEFAULT_PALETTES);
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [newPaletteColors, setNewPaletteColors] = useState(['#000000', '#333333', '#666666', '#ffa742', '#ffffff']);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
    loadSavedPalettes();
    loadAvailableTextures();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, logsRes] = await Promise.all([fetch('/api/projects'), fetch('/api/logs')]);
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

  const fetchProjectMedia = async (projectId) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/projects/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.data?.media) setProjectMedia(data.data.media);
    } catch (err) { console.error('Error fetching project media:', err); }
  };

  const loadAvailableTextures = () => {
    setAvailableTextures(['noise_light.png', 'noise_dark.png', 'grid_subtle.png', 'dots_pattern.png', 'lines_diagonal.png', 'gradient_radial.png', 'tech_circuit.png', 'halftone.png']);
  };

  const loadSavedPalettes = () => {
    const saved = localStorage.getItem('social_palettes');
    if (saved) {
      try { setSavedPalettes([...DEFAULT_PALETTES, ...JSON.parse(saved)]); } catch (e) {}
    }
  };

  const savePalette = () => {
    if (!newPaletteName.trim()) return;
    const newPalette = { id: `custom_${Date.now()}`, name: newPaletteName, colors: newPaletteColors, custom: true };
    const customPalettes = savedPalettes.filter(p => p.custom);
    localStorage.setItem('social_palettes', JSON.stringify([...customPalettes, newPalette]));
    setSavedPalettes([...DEFAULT_PALETTES, ...customPalettes, newPalette]);
    setShowPaletteModal(false);
    setNewPaletteName('');
  };

  const deletePalette = (paletteId) => {
    const customPalettes = savedPalettes.filter(p => p.custom && p.id !== paletteId);
    localStorage.setItem('social_palettes', JSON.stringify(customPalettes));
    setSavedPalettes([...DEFAULT_PALETTES, ...customPalettes]);
  };

  const applyPalette = (palette) => {
    setDesign(prev => ({ ...prev, backgroundColor: palette.colors[0], gradientColor1: palette.colors[0], gradientColor2: palette.colors[1], frameColor: palette.colors[3] }));
    setTextSettings(prev => ({ ...prev, headlineColor: palette.colors[4], subtextColor: palette.colors[2] }));
  };

  const loadLogContent = (log) => {
    setSelectedLog(log);
    setHeadline(log.one_liner || '');
    setSubtext(log.challenge_abstract || '');
  };

  const selectMediaAsset = (mediaUrl) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setMediaAsset(prev => ({ ...prev, enabled: true, url: mediaUrl, image: img }));
    img.src = mediaUrl;
  };

  const addTexture = (textureFile) => {
    const newTexture = { id: `tex_${Date.now()}`, file: textureFile, opacity: 30, blendMode: 'overlay' };
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLoadedTextureImages(prev => ({ ...prev, [newTexture.id]: img }));
    img.src = `/social_bgs/${textureFile}`;
    setTextures(prev => [...prev, newTexture]);
  };

  const updateTexture = (id, field, value) => setTextures(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  const removeTexture = (id) => {
    setTextures(prev => prev.filter(t => t.id !== id));
    setLoadedTextureImages(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = PLATFORMS[platform];
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    // Background
    if (design.backgroundGradient) {
      const angle = design.gradientAngle * Math.PI / 180;
      const gradient = ctx.createLinearGradient(
        width/2 - Math.cos(angle)*width, height/2 - Math.sin(angle)*height,
        width/2 + Math.cos(angle)*width, height/2 + Math.sin(angle)*height
      );
      gradient.addColorStop(0, design.gradientColor1);
      gradient.addColorStop(1, design.gradientColor2);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = design.backgroundColor;
    }
    ctx.fillRect(0, 0, width, height);

    // Textures - scale to fit canvas (max width or height)
textures.forEach(tex => {
  const img = loadedTextureImages[tex.id];
  if (img) {
    ctx.save();
    ctx.globalAlpha = tex.opacity / 100;
    ctx.globalCompositeOperation = tex.blendMode;
    
    // Scale 800x800 SVG to cover canvas
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let drawW, drawH, drawX, drawY;
    
    if (canvasRatio > imgRatio) {
      // Canvas is wider - fit to width
      drawW = width;
      drawH = width / imgRatio;
    } else {
      // Canvas is taller - fit to height
      drawH = height;
      drawW = height * imgRatio;
    }
    
    // Center the texture
    drawX = (width - drawW) / 2;
    drawY = (height - drawH) / 2;
    
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
});

    // Media asset
    if (mediaAsset.enabled && mediaAsset.image) {
      const img = mediaAsset.image;
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      let maxW, maxH;
      if (imgRatio > canvasRatio) { maxW = width; maxH = width / imgRatio; }
      else { maxH = height; maxW = height * imgRatio; }
      const scale = mediaAsset.size / 100;
      const drawW = maxW * scale, drawH = maxH * scale;
      const x = (width - drawW) * (mediaAsset.posX / 100);
      const y = (height - drawH) * (mediaAsset.posY / 100);
      ctx.drawImage(img, x, y, drawW, drawH);
    }

    // Frame
    const frameColor = design.frameColor;
    const opacity = design.frameOpacity / 100;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = frameColor;
    ctx.fillStyle = frameColor;
    const margin = Math.min(width, height) * 0.05;
    const cornerSize = Math.min(width, height) * 0.08;

    if (design.frameStyle === 'corners') {
      ctx.lineWidth = 3;
      [[margin, margin+cornerSize, margin, margin, margin+cornerSize, margin],
       [width-margin-cornerSize, margin, width-margin, margin, width-margin, margin+cornerSize],
       [margin, height-margin-cornerSize, margin, height-margin, margin+cornerSize, height-margin],
       [width-margin-cornerSize, height-margin, width-margin, height-margin, width-margin, height-margin-cornerSize]
      ].forEach(([x1,y1,x2,y2,x3,y3]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.stroke(); });
    } else if (design.frameStyle === 'border') {
      ctx.lineWidth = 4;
      ctx.strokeRect(margin, margin, width-margin*2, height-margin*2);
    } else if (design.frameStyle === 'gradient_border') {
      ctx.lineWidth = 6;
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, frameColor); g.addColorStop(0.5, 'transparent'); g.addColorStop(1, frameColor);
      ctx.strokeStyle = g;
      ctx.strokeRect(margin, margin, width-margin*2, height-margin*2);
    } else if (design.frameStyle === 'scan_lines') {
      ctx.globalAlpha = opacity * 0.1;
      for (let y = 0; y < height; y += 4) ctx.fillRect(0, y, width, 2);
    } else if (design.frameStyle === 'grid') {
      ctx.globalAlpha = opacity * 0.1; ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    } else if (design.frameStyle === 'circuit') {
      ctx.lineWidth = 2; ctx.globalAlpha = opacity * 0.3;
      for (let i = 0; i < 3; i++) {
        const y = margin*2 + (i * (height - margin*4) / 2);
        ctx.beginPath(); ctx.moveTo(margin*2, y); ctx.lineTo(width-margin*2, y); ctx.stroke();
        for (let j = 0; j < 5; j++) {
          const x = margin*2 + (j * (width - margin*4) / 4);
          ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill();
        }
      }
    }
    ctx.restore();

    // Text helper
    const drawTextBlock = (text, font, size, color, align, yPercent, bold) => {
      const f = FONTS.find(fo => fo.id === font);
      ctx.font = `${bold ? 'bold ' : ''}${size}px ${f?.family || 'monospace'}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      const x = align === 'center' ? width/2 : align === 'right' ? width-60 : 60;
      const y = height * (yPercent / 100);
      const maxWidth = width - 120;
      const words = text.split(' ');
      let lines = [], currentLine = '';
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine); currentLine = word;
        } else currentLine = testLine;
      });
      if (currentLine) lines.push(currentLine);
      lines.forEach((line, i) => ctx.fillText(line, x, y + (i * size * 1.3)));
    };

    if (headline) drawTextBlock(headline, textSettings.headlineFont, textSettings.headlineSize, textSettings.headlineColor, textSettings.headlineAlign, textSettings.headlineY, true);
    if (subtext) drawTextBlock(subtext, textSettings.subtextFont, textSettings.subtextSize, textSettings.subtextColor, textSettings.subtextAlign, textSettings.subtextY, false);
    if (extraText1.enabled && extraText1.text) drawTextBlock(extraText1.text, textSettings.extra1Font, textSettings.extra1Size, textSettings.extra1Color, textSettings.extra1Align, textSettings.extra1Y, false);
    if (extraText2.enabled && extraText2.text) drawTextBlock(extraText2.text, textSettings.extra2Font, textSettings.extra2Size, textSettings.extra2Color, textSettings.extra2Align, textSettings.extra2Y, false);

  }, [platform, design, headline, subtext, extraText1, extraText2, textSettings, mediaAsset, textures, loadedTextureImages]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const exportImage = async (format = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const dataUrl = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
      const link = document.createElement('a');
      link.download = `social_${platform}_${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error('Export error:', err); }
    finally { setExporting(false); }
  };

  const updateDesign = (field, value) => setDesign(prev => ({ ...prev, [field]: value }));
  const updateTextSettings = (field, value) => setTextSettings(prev => ({ ...prev, [field]: value }));
  const updateMediaAsset = (field, value) => setMediaAsset(prev => ({ ...prev, [field]: value }));

  if (loading) return <AdminLayout title="Social Generator"><div className={styles.loading}>Loading...</div></AdminLayout>;

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
          {/* Left Panel */}
          <div className={styles.controlsPanel}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Source</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project</label>
                <select className={styles.select} value={selectedProject?.id || ''} onChange={(e) => {
                  const proj = projects.find(p => p.id === e.target.value);
                  setSelectedProject(proj || null); setSelectedLog(null); setProjectMedia([]);
                  if (proj) fetchProjectMedia(proj.id);
                }}>
                  <option value="">Select project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.display_name_en || p.alias}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dev Log</label>
                <select className={styles.select} value={selectedLog?.id || ''} onChange={(e) => {
                  const log = logs.find(l => l.id === e.target.value);
                  if (log) loadLogContent(log);
                }}>
                  <option value="">Select log...</option>
                  {logs.filter(l => !selectedProject || l.project_id === selectedProject.id).map(l => (
                    <option key={l.id} value={l.id}>[{l.entry_type?.toUpperCase()}] {l.one_liner?.substring(0, 40)}...</option>
                  ))}
                </select>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Platform & Size</h3>
              <div className={styles.formGroup}>
                <select className={styles.select} value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  {PLATFORM_GROUPS.map(group => (
                    <optgroup key={group} label={group}>
                      {Object.entries(PLATFORMS).filter(([_, p]) => p.group === group).map(([key, p]) => (
                        <option key={key} value={key}>{p.name} ({p.width}x{p.height})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className={styles.platformInfo}>{PLATFORMS[platform].width} x {PLATFORMS[platform].height} px</div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Media Asset</h3>
              {projectMedia.length > 0 ? (
                <>
                  <div className={styles.mediaGrid}>
                    {projectMedia.map(m => (
                      <div key={m.id} className={`${styles.mediaThumb} ${mediaAsset.url === m.media_url ? styles.selected : ''}`} onClick={() => selectMediaAsset(m.media_url)}>
                        {m.media_type === 'video' ? <video src={m.media_url} muted /> : <img src={m.media_url} alt="" />}
                      </div>
                    ))}
                  </div>
                  {mediaAsset.enabled && (
                    <div className={styles.assetControls}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Size: {mediaAsset.size}%</label>
                        <input type="range" className={styles.range} min="10" max="150" value={mediaAsset.size} onChange={(e) => updateMediaAsset('size', parseInt(e.target.value))} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Position X: {mediaAsset.posX}%</label>
                        <input type="range" className={styles.range} min="0" max="100" value={mediaAsset.posX} onChange={(e) => updateMediaAsset('posX', parseInt(e.target.value))} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Position Y: {mediaAsset.posY}%</label>
                        <input type="range" className={styles.range} min="0" max="100" value={mediaAsset.posY} onChange={(e) => updateMediaAsset('posY', parseInt(e.target.value))} />
                      </div>
                      <button className={styles.removeAssetBtn} onClick={() => setMediaAsset({ enabled: false, url: '', image: null, size: 80, posX: 50, posY: 50 })}>Remove Asset</button>
                    </div>
                  )}
                </>
              ) : <p className={styles.noMedia}>Select a project to view media</p>}
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Background Textures</h3>
              <div className={styles.textureGrid}>
                {availableTextures.map(tex => (
                  <div key={tex} className={styles.textureThumb} onClick={() => addTexture(tex)} title={tex}>
                    <img src={`/social_bgs/${tex}`} alt={tex} onError={(e) => e.target.style.display='none'} />
                  </div>
                ))}
              </div>
              {textures.length > 0 && (
                <div className={styles.textureStack}>
                  {textures.map((tex, i) => (
                    <div key={tex.id} className={styles.textureLayer}>
                      <div className={styles.textureLayerHeader}>
                        <span>Layer {i + 1}</span>
                        <button className={styles.removeTextureBtn} onClick={() => removeTexture(tex.id)}>x</button>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Opacity: {tex.opacity}%</label>
                        <input type="range" className={styles.range} min="0" max="100" value={tex.opacity} onChange={(e) => updateTexture(tex.id, 'opacity', parseInt(e.target.value))} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Blend Mode</label>
                        <select className={styles.select} value={tex.blendMode} onChange={(e) => updateTexture(tex.id, 'blendMode', e.target.value)}>
                          {BLEND_MODES.map(bm => <option key={bm.id} value={bm.id}>{bm.name}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Color Palettes</h3>
                <button className={styles.addPaletteBtn} onClick={() => setShowPaletteModal(true)}>+ Save</button>
              </div>
              <div className={styles.palettesGrid}>
                {savedPalettes.map(palette => (
                  <div key={palette.id} className={styles.paletteCard} onClick={() => applyPalette(palette)}>
                    <div className={styles.paletteColors}>{palette.colors.map((c, i) => <div key={i} className={styles.paletteColor} style={{ backgroundColor: c }} />)}</div>
                    <span className={styles.paletteName}>{palette.name}</span>
                    {palette.custom && <button className={styles.deletePaletteBtn} onClick={(e) => { e.stopPropagation(); deletePalette(palette.id); }}>x</button>}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Background Color</h3>
              <label className={styles.checkbox}><input type="checkbox" checked={design.backgroundGradient} onChange={(e) => updateDesign('backgroundGradient', e.target.checked)} /> Use Gradient</label>
              {design.backgroundGradient ? (
                <>
                  <div className={styles.colorRow}>
                    <div className={styles.colorInput}><input type="color" value={design.gradientColor1} onChange={(e) => updateDesign('gradientColor1', e.target.value)} /><span>Color 1</span></div>
                    <div className={styles.colorInput}><input type="color" value={design.gradientColor2} onChange={(e) => updateDesign('gradientColor2', e.target.value)} /><span>Color 2</span></div>
                  </div>
                  <div className={styles.formGroup}><label className={styles.label}>Angle: {design.gradientAngle}</label><input type="range" className={styles.range} min="0" max="360" value={design.gradientAngle} onChange={(e) => updateDesign('gradientAngle', parseInt(e.target.value))} /></div>
                </>
              ) : <div className={styles.colorInput}><input type="color" value={design.backgroundColor} onChange={(e) => updateDesign('backgroundColor', e.target.value)} /><span>{design.backgroundColor}</span></div>}
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Frame Style</h3>
              <select className={styles.select} value={design.frameStyle} onChange={(e) => updateDesign('frameStyle', e.target.value)}>
                {FRAME_STYLES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              {design.frameStyle !== 'none' && (
                <>
                  <div className={styles.colorInput}><input type="color" value={design.frameColor} onChange={(e) => updateDesign('frameColor', e.target.value)} /><span>Frame Color</span></div>
                  <div className={styles.formGroup}><label className={styles.label}>Opacity: {design.frameOpacity}%</label><input type="range" className={styles.range} min="0" max="100" value={design.frameOpacity} onChange={(e) => updateDesign('frameOpacity', parseInt(e.target.value))} /></div>
                </>
              )}
            </section>
          </div>

          {/* Center - Canvas */}
          <div className={styles.canvasPanel}>
            <div className={styles.canvasHeader}>
              <span className={styles.canvasDimensions}>{PLATFORMS[platform].width} x {PLATFORMS[platform].height}</span>
              <div className={styles.zoomControls}>
                <button onClick={() => setCanvasScale(Math.max(0.1, canvasScale - 0.1))}>-</button>
                <span>{Math.round(canvasScale * 100)}%</span>
                <button onClick={() => setCanvasScale(Math.min(1, canvasScale + 0.1))}>+</button>
              </div>
            </div>
            <div className={styles.canvasContainer} ref={containerRef}>
              <canvas ref={canvasRef} className={styles.canvas} style={{ transform: `scale(${canvasScale})`, transformOrigin: 'top center' }} />
            </div>
            <div className={styles.canvasFooter}>
              <button className={styles.exportBtn} onClick={() => exportImage('png')} disabled={exporting}>{exporting ? 'Exporting...' : 'Download PNG'}</button>
              <button className={styles.exportBtnSecondary} onClick={() => exportImage('jpg')} disabled={exporting}>Download JPG</button>
            </div>
          </div>

          {/* Right Panel - Text */}
          <div className={styles.textPanel}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Headline</h3>
              <textarea className={styles.textarea} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Main headline..." rows={3} />
              <div className={styles.formRow}>
                <div className={styles.formGroup}><label className={styles.label}>Font</label><select className={styles.select} value={textSettings.headlineFont} onChange={(e) => updateTextSettings('headlineFont', e.target.value)}>{FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                <div className={styles.formGroup}><label className={styles.label}>Size</label><input type="number" className={styles.input} value={textSettings.headlineSize} onChange={(e) => updateTextSettings('headlineSize', parseInt(e.target.value))} min={12} max={200} /></div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.colorInput}><input type="color" value={textSettings.headlineColor} onChange={(e) => updateTextSettings('headlineColor', e.target.value)} /><span>Color</span></div>
                <div className={styles.alignBtns}>{TEXT_ALIGNS.map(a => <button key={a} className={`${styles.alignBtn} ${textSettings.headlineAlign === a ? styles.active : ''}`} onClick={() => updateTextSettings('headlineAlign', a)}>{a === 'left' ? '◧' : a === 'center' ? '◫' : '◨'}</button>)}</div>
              </div>
              <div className={styles.formGroup}><label className={styles.label}>Position Y: {textSettings.headlineY}%</label><input type="range" className={styles.range} min="5" max="95" value={textSettings.headlineY} onChange={(e) => updateTextSettings('headlineY', parseInt(e.target.value))} /></div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Subtext</h3>
              <textarea className={styles.textarea} value={subtext} onChange={(e) => setSubtext(e.target.value)} placeholder="Supporting text..." rows={3} />
              <div className={styles.formRow}>
                <div className={styles.formGroup}><label className={styles.label}>Font</label><select className={styles.select} value={textSettings.subtextFont} onChange={(e) => updateTextSettings('subtextFont', e.target.value)}>{FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                <div className={styles.formGroup}><label className={styles.label}>Size</label><input type="number" className={styles.input} value={textSettings.subtextSize} onChange={(e) => updateTextSettings('subtextSize', parseInt(e.target.value))} min={10} max={100} /></div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.colorInput}><input type="color" value={textSettings.subtextColor} onChange={(e) => updateTextSettings('subtextColor', e.target.value)} /><span>Color</span></div>
                <div className={styles.alignBtns}>{TEXT_ALIGNS.map(a => <button key={a} className={`${styles.alignBtn} ${textSettings.subtextAlign === a ? styles.active : ''}`} onClick={() => updateTextSettings('subtextAlign', a)}>{a === 'left' ? '◧' : a === 'center' ? '◫' : '◨'}</button>)}</div>
              </div>
              <div className={styles.formGroup}><label className={styles.label}>Position Y: {textSettings.subtextY}%</label><input type="range" className={styles.range} min="5" max="95" value={textSettings.subtextY} onChange={(e) => updateTextSettings('subtextY', parseInt(e.target.value))} /></div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}><h3 className={styles.sectionTitle}>Extra Text 1</h3><label className={styles.toggleSwitch}><input type="checkbox" checked={extraText1.enabled} onChange={(e) => setExtraText1(p => ({ ...p, enabled: e.target.checked }))} /><span className={styles.toggleSlider}></span></label></div>
              {extraText1.enabled && (
                <>
                  <input type="text" className={styles.input} value={extraText1.text} onChange={(e) => setExtraText1(p => ({ ...p, text: e.target.value }))} placeholder="e.g. marcomotion.com" />
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}><label className={styles.label}>Font</label><select className={styles.select} value={textSettings.extra1Font} onChange={(e) => updateTextSettings('extra1Font', e.target.value)}>{FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                    <div className={styles.formGroup}><label className={styles.label}>Size</label><input type="number" className={styles.input} value={textSettings.extra1Size} onChange={(e) => updateTextSettings('extra1Size', parseInt(e.target.value))} min={8} max={60} /></div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.colorInput}><input type="color" value={textSettings.extra1Color} onChange={(e) => updateTextSettings('extra1Color', e.target.value)} /><span>Color</span></div>
                    <div className={styles.alignBtns}>{TEXT_ALIGNS.map(a => <button key={a} className={`${styles.alignBtn} ${textSettings.extra1Align === a ? styles.active : ''}`} onClick={() => updateTextSettings('extra1Align', a)}>{a === 'left' ? '◧' : a === 'center' ? '◫' : '◨'}</button>)}</div>
                  </div>
                  <div className={styles.formGroup}><label className={styles.label}>Position Y: {textSettings.extra1Y}%</label><input type="range" className={styles.range} min="5" max="95" value={textSettings.extra1Y} onChange={(e) => updateTextSettings('extra1Y', parseInt(e.target.value))} /></div>
                </>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}><h3 className={styles.sectionTitle}>Extra Text 2</h3><label className={styles.toggleSwitch}><input type="checkbox" checked={extraText2.enabled} onChange={(e) => setExtraText2(p => ({ ...p, enabled: e.target.checked }))} /><span className={styles.toggleSlider}></span></label></div>
              {extraText2.enabled && (
                <>
                  <input type="text" className={styles.input} value={extraText2.text} onChange={(e) => setExtraText2(p => ({ ...p, text: e.target.value }))} placeholder="e.g. @marcomotion" />
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}><label className={styles.label}>Font</label><select className={styles.select} value={textSettings.extra2Font} onChange={(e) => updateTextSettings('extra2Font', e.target.value)}>{FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                    <div className={styles.formGroup}><label className={styles.label}>Size</label><input type="number" className={styles.input} value={textSettings.extra2Size} onChange={(e) => updateTextSettings('extra2Size', parseInt(e.target.value))} min={8} max={60} /></div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.colorInput}><input type="color" value={textSettings.extra2Color} onChange={(e) => updateTextSettings('extra2Color', e.target.value)} /><span>Color</span></div>
                    <div className={styles.alignBtns}>{TEXT_ALIGNS.map(a => <button key={a} className={`${styles.alignBtn} ${textSettings.extra2Align === a ? styles.active : ''}`} onClick={() => updateTextSettings('extra2Align', a)}>{a === 'left' ? '◧' : a === 'center' ? '◫' : '◨'}</button>)}</div>
                  </div>
                  <div className={styles.formGroup}><label className={styles.label}>Position Y: {textSettings.extra2Y}%</label><input type="range" className={styles.range} min="5" max="95" value={textSettings.extra2Y} onChange={(e) => updateTextSettings('extra2Y', parseInt(e.target.value))} /></div>
                </>
              )}
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>AI Suggestions</h3>
              <p className={styles.aiNote}>Select a dev log to generate AI headlines.</p>
              <button className={styles.aiBtn} disabled={!selectedLog}>Generate Headlines</button>
            </section>
          </div>
        </div>

        {showPaletteModal && (
          <div className={styles.modalOverlay} onClick={() => setShowPaletteModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Save Color Palette</h3>
              <div className={styles.formGroup}><label className={styles.label}>Name</label><input type="text" className={styles.input} value={newPaletteName} onChange={(e) => setNewPaletteName(e.target.value)} placeholder="My Palette" /></div>
              <div className={styles.formGroup}><label className={styles.label}>Colors</label><div className={styles.paletteEditor}>{newPaletteColors.map((c, i) => <input key={i} type="color" value={c} onChange={(e) => { const n = [...newPaletteColors]; n[i] = e.target.value; setNewPaletteColors(n); }} />)}</div></div>
              <div className={styles.modalActions}><button className={styles.cancelBtn} onClick={() => setShowPaletteModal(false)}>Cancel</button><button className={styles.saveBtn} onClick={savePalette}>Save</button></div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
