import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminProjects.module.css';

const CATEGORIES = [
  // Development & Engineering
  { slug: 'saas', label: 'SaaS Platform', group: 'dev' },
  { slug: 'web', label: 'Web App', group: 'dev' },
  { slug: 'apps', label: 'Apps', group: 'dev' },
  { slug: 'frontend', label: 'Frontend', group: 'dev' },
  { slug: 'backend', label: 'Backend', group: 'dev' },
  { slug: 'fullstack', label: 'Full Stack', group: 'dev' },
  { slug: 'api', label: 'API', group: 'dev' },
  { slug: 'tool', label: 'Dev Tool', group: 'dev' },
  { slug: 'automation', label: 'Automation', group: 'dev' },
  { slug: 'scripting', label: 'Scripting', group: 'dev' },
  
  // Design & UX
  { slug: 'uiux', label: 'UI/UX', group: 'design' },
  { slug: 'design', label: 'Design', group: 'design' },
  { slug: 'branding', label: 'Branding', group: 'design' },
  { slug: 'typography', label: 'Typography', group: 'design' },
  { slug: 'illustration', label: 'Illustration', group: 'design' },
  
  // Motion & Animation
  { slug: 'motion', label: 'Motion Graphics', group: 'motion' },
  { slug: 'animation', label: 'Animation', group: 'motion' },
  { slug: 'vfx', label: 'VFX', group: 'motion' },
  { slug: 'compositing', label: 'Compositing', group: 'motion' },
  { slug: 'kinetic', label: 'Kinetic Type', group: 'motion' },
  { slug: 'transitions', label: 'Transitions', group: 'motion' },
  
  // Video & Film
  { slug: 'editing', label: 'Editing', group: 'video' },
  { slug: 'color-grading', label: 'Color Grading', group: 'video' },
  { slug: 'storytelling', label: 'Storytelling', group: 'video' },
  { slug: 'documentary', label: 'Documentary', group: 'video' },
  { slug: 'commercial', label: 'Commercial', group: 'video' },
  { slug: 'music-video', label: 'Music Video', group: 'video' },
  { slug: 'short-film', label: 'Short Film', group: 'video' },
  
  // Interactive & Web
  { slug: 'interactive-motion', label: 'Interactive Motion', group: 'interactive' },
  { slug: 'creative-coding', label: 'Creative Coding', group: 'interactive' },
  { slug: 'threejs', label: '3D / WebGL', group: 'interactive' },
  { slug: 'generative', label: 'Generative Art', group: 'interactive' },
  { slug: 'data-viz', label: 'Data Visualization', group: 'interactive' },
  
  // AI & Emerging Tech
  { slug: 'ai-image', label: 'AI Image', group: 'ai' },
  { slug: 'ai-video', label: 'AI Video', group: 'ai' },
  { slug: 'ai-audio', label: 'AI Audio', group: 'ai' },
  { slug: 'prompt-engineering', label: 'Prompt Engineering', group: 'ai' },
  
  // 3D & Realtime
  { slug: '3d', label: '3D', group: '3d' },
  { slug: 'modeling', label: '3D Modeling', group: '3d' },
  { slug: 'shaders', label: 'Shaders', group: '3d' },
  { slug: 'realtime', label: 'Real-time', group: '3d' },
  
  // Audio & Sound
  { slug: 'sound-design', label: 'Sound Design', group: 'audio' },
  { slug: 'audio-visual', label: 'Audio Visual', group: 'audio' },
  
  // Content Type
  { slug: 'experiment', label: 'Experiment', group: 'content' },
  { slug: 'product', label: 'Product', group: 'content' },
  { slug: 'prototype', label: 'Prototype', group: 'content' },
  { slug: 'template', label: 'Template', group: 'content' },
  { slug: 'plugin', label: 'Plugin', group: 'content' },
  { slug: 'tutorial', label: 'Tutorial', group: 'content' },
];

// Category groups for organized dropdown
const CATEGORY_GROUPS = {
  dev: { label: 'Development' },
  design: { label: 'Design' },
  motion: { label: 'Motion' },
  video: { label: 'Video' },
  interactive: { label: 'Interactive' },
  ai: { label: 'AI & ML' },
  '3d': { label: '3D & Realtime' },
  audio: { label: 'Audio' },
  content: { label: 'Content Type' },
};

// Extended tags organized by group
const TAG_GROUPS = {
  dev: { label: 'Development', tags: [
    { slug: 'apps', label: 'Apps' },
    { slug: 'frontend', label: 'Frontend' },
    { slug: 'backend', label: 'Backend' },
    { slug: 'fullstack', label: 'Full Stack' },
    { slug: 'api', label: 'API' },
    { slug: 'automation', label: 'Automation' },
    { slug: 'scripting', label: 'Scripting' },
  ]},
  design: { label: 'Design', tags: [
    { slug: 'uiux', label: 'UI/UX' },
    { slug: 'design', label: 'Design' },
    { slug: 'branding', label: 'Branding' },
    { slug: 'typography', label: 'Typography' },
    { slug: 'illustration', label: 'Illustration' },
  ]},
  motion: { label: 'Motion', tags: [
    { slug: 'motion-graphics', label: 'Motion Graphics' },
    { slug: 'animation', label: 'Animation' },
    { slug: 'vfx', label: 'VFX' },
    { slug: 'compositing', label: 'Compositing' },
    { slug: 'kinetic', label: 'Kinetic Type' },
  ]},
  video: { label: 'Video', tags: [
    { slug: 'editing', label: 'Editing' },
    { slug: 'color-grading', label: 'Color Grading' },
    { slug: 'storytelling', label: 'Storytelling' },
    { slug: 'commercial', label: 'Commercial' },
    { slug: 'music-video', label: 'Music Video' },
  ]},
  interactive: { label: 'Interactive', tags: [
    { slug: 'interactive-motion', label: 'Interactive Motion' },
    { slug: 'creative-coding', label: 'Creative Coding' },
    { slug: 'webgl', label: 'WebGL' },
    { slug: 'generative', label: 'Generative Art' },
    { slug: 'data-viz', label: 'Data Visualization' },
  ]},
  ai: { label: 'AI & ML', tags: [
    { slug: 'ai-image', label: 'AI Image' },
    { slug: 'ai-video', label: 'AI Video' },
    { slug: 'ai-audio', label: 'AI Audio' },
    { slug: 'prompt-engineering', label: 'Prompt Engineering' },
  ]},
  threeD: { label: '3D & Realtime', tags: [
    { slug: '3d', label: '3D' },
    { slug: 'modeling', label: '3D Modeling' },
    { slug: 'shaders', label: 'Shaders' },
    { slug: 'realtime', label: 'Real-time' },
  ]},
  content: { label: 'Content Type', tags: [
    { slug: 'product', label: 'Product' },
    { slug: 'prototype', label: 'Prototype' },
    { slug: 'template', label: 'Template' },
    { slug: 'plugin', label: 'Plugin' },
    { slug: 'tutorial', label: 'Tutorial' },
  ]},
};

const ENTRY_TYPES = [
  { type: 'build', label: 'BUILD', color: '#ffa742' },
  { type: 'ship', label: 'SHIP', color: '#4ade80' },
  { type: 'experiment', label: 'EXPERIMENT', color: '#06b6d4' },
  { type: 'polish', label: 'POLISH', color: '#a78bfa' },
  { type: 'study', label: 'STUDY', color: '#3b82f6' },
  { type: 'wire', label: 'WIRE', color: '#f59e0b' },
];

const MEDIA_TYPES = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'gif', label: 'GIF' },
  { value: 'vimeo', label: 'Vimeo URL' },
  { value: 'youtube', label: 'YouTube URL' },
];

const emptyProject = {
  alias: '',
  displayNameEn: '',
  displayNameEs: '',
  descriptionEn: '',
  descriptionEs: '',
  category: 'web',
  status: 'active',
  progress: 0,
  accentColor: '#ffa742',
  techStack: [],
  tags: [],
  externalUrl: '',
  isFeatured: false,
};

const emptyLog = {
  entryType: 'build',
  oneLiner: '',
  challengeAbstract: '',
  mentalNote: '',
};

const emptyMedia = {
  mediaType: 'image',
  mediaUrl: '',
  captionEn: '',
  captionEs: '',
  file: null,
};

// Helper to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form states
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [logs, setLogs] = useState([]);
  const [existingLogs, setExistingLogs] = useState([]);
  const [media, setMedia] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setLoading(false);
    }
  };

  const openNewProject = () => {
    setEditingProject(null);
    setProjectForm(emptyProject);
    setLogs([{ ...emptyLog, id: `new-log-${Date.now()}` }]);
    setExistingLogs([]);
    setMedia([]);
    setActiveTab('details');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditProject = async (project) => {
    setEditingProject(project);
    setProjectForm({
      alias: project.alias || '',
      displayNameEn: project.display_name_en || '',
      displayNameEs: project.display_name_es || '',
      descriptionEn: project.description_en || '',
      descriptionEs: project.description_es || '',
      category: project.category || 'web',
      status: project.status || 'active',
      progress: project.progress || 0,
      accentColor: project.accent_color || '#ffa742',
      techStack: JSON.parse(project.tech_stack || '[]'),
      tags: JSON.parse(project.tags || '[]'),
      externalUrl: project.external_url || '',
      isFeatured: project.is_featured === 1,
    });
    setLogs([]);
    setExistingLogs([]);
    setMedia([]);
    setActiveTab('details');
    setError('');
    setSuccess('');
    setShowModal(true);

    // Fetch project details with logs and media
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setExistingLogs(data.data.logs || []);
          // Transform media to local format
          const mediaItems = (data.data.media || []).map(m => ({
            id: m.id,
            mediaType: m.media_type,
            mediaUrl: m.media_url,
            captionEn: m.caption_en || '',
            captionEs: m.caption_es || '',
            file: null,
            existing: true,
          }));
          setMedia(mediaItems);
        }
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setProjectForm(emptyProject);
    setLogs([]);
    setExistingLogs([]);
    setMedia([]);
    setError('');
    setSuccess('');
    setShowDeleteConfirm(false);
  };

  // Project form handlers
  const handleProjectChange = (field, value) => {
    setProjectForm(prev => ({ ...prev, [field]: value }));
  };

  const addTechTag = () => {
    if (techInput.trim() && !projectForm.techStack.includes(techInput.trim())) {
      setProjectForm(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTechTag = (tag) => {
    setProjectForm(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tag),
    }));
  };

  // Tag handlers
  const toggleTag = (tagSlug) => {
    setProjectForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagSlug)
        ? prev.tags.filter(t => t !== tagSlug)
        : [...prev.tags, tagSlug],
    }));
  };

  // Log handlers
  const addLog = () => {
    setLogs(prev => [...prev, { ...emptyLog, id: `new-log-${Date.now()}` }]);
  };

  const updateLog = (index, field, value) => {
    setLogs(prev => prev.map((log, i) => 
      i === index ? { ...log, [field]: value } : log
    ));
  };

  const removeLog = (index) => {
    setLogs(prev => prev.filter((_, i) => i !== index));
  };

  // Media handlers
  const addMedia = () => {
    setMedia(prev => [...prev, { ...emptyMedia, id: `new-media-${Date.now()}` }]);
  };

  const updateMedia = (index, field, value) => {
    setMedia(prev => prev.map((m, i) => 
      i === index ? { ...m, [field]: value } : m
    ));
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileSelect = (index, file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setMedia(prev => prev.map((m, i) => {
        if (i !== index) return m;
        let mediaType = m.mediaType;
        if (file.type.startsWith('image/gif')) {
          mediaType = 'gif';
        } else if (file.type.startsWith('image/')) {
          mediaType = 'image';
        } else if (file.type.startsWith('video/')) {
          mediaType = 'video';
        }
        return { ...m, file, mediaUrl: url, mediaType };
      }));
    }
  };

  // Upload media files to server
  const uploadMedia = async (projectId, token) => {
    const mediaWithFiles = media.filter(m => m.file);
    const uploadedMedia = [];

    for (const m of mediaWithFiles) {
      try {
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('file', m.file);
        formData.append('mediaType', m.mediaType);
        formData.append('captionEn', m.captionEn || '');
        formData.append('captionEs', m.captionEs || '');
        formData.append('displayOrder', m.displayOrder?.toString() || '0');

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          uploadedMedia.push(result.data);
        }
      } catch (err) {
        console.error('Media upload error:', err);
      }
    }

    // Also handle URL-based media (vimeo, youtube)
    const urlMedia = media.filter(m => !m.file && m.mediaUrl && ['vimeo', 'youtube'].includes(m.mediaType));
    for (const m of urlMedia) {
      try {
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('mediaUrl', m.mediaUrl);
        formData.append('mediaType', m.mediaType);
        formData.append('captionEn', m.captionEn || '');
        formData.append('captionEs', m.captionEs || '');
        formData.append('displayOrder', m.displayOrder?.toString() || '0');

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          uploadedMedia.push(result.data);
        }
      } catch (err) {
        console.error('Media URL save error:', err);
      }
    }

    return uploadedMedia;
  };

  // Save project - REAL API CONNECTION
  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    // Validate
    if (!projectForm.alias.trim()) {
      setError('Project alias is required');
      setSaving(false);
      return;
    }
    if (!projectForm.displayNameEn.trim()) {
      setError('Display name (EN) is required');
      setSaving(false);
      return;
    }

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Not authenticated. Please login again.');
        setSaving(false);
        return;
      }

      // Prepare payload
      const payload = {
        alias: projectForm.alias,
        displayNameEn: projectForm.displayNameEn,
        displayNameEs: projectForm.displayNameEs || null,
        descriptionEn: projectForm.descriptionEn || null,
        descriptionEs: projectForm.descriptionEs || null,
        category: projectForm.category,
        status: projectForm.status,
        progress: projectForm.progress,
        accentColor: projectForm.accentColor,
        techStack: projectForm.techStack,
        tags: projectForm.tags,
        externalUrl: projectForm.externalUrl || null,
        isFeatured: projectForm.isFeatured,
      };

      let response;
      
      if (editingProject) {
        // UPDATE existing project
        // Add new logs only (not existing ones)
        const newLogs = logs.filter(l => l.oneLiner && l.oneLiner.trim());
        if (newLogs.length > 0) {
          payload.newLogs = newLogs;
        }

        response = await fetch(`/api/admin/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE new project
        // Include logs with new project
        const validLogs = logs.filter(l => l.oneLiner && l.oneLiner.trim());
        if (validLogs.length > 0) {
          payload.logs = validLogs;
        }

        response = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save project');
      }

      // Upload media if any
      const projectId = editingProject?.id || result.data?.id;
      if (projectId && media.length > 0) {
        const hasMediaToUpload = media.some(m => m.file || (m.mediaUrl && ['vimeo', 'youtube'].includes(m.mediaType)));
        if (hasMediaToUpload) {
          await uploadMedia(projectId, token);
        }
      }

      // Success - refresh projects list
      setSuccess(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      await fetchProjects();
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        closeModal();
      }, 1000);

    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Delete project - REAL API CONNECTION
  const handleDelete = async () => {
    if (!editingProject) return;
    
    setError('');
    setDeleting(true);

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Not authenticated. Please login again.');
        setDeleting(false);
        return;
      }

      const response = await fetch(`/api/admin/projects/${editingProject.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete project');
      }

      // Success - refresh and close
      await fetchProjects();
      closeModal();

    } catch (err) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { active: '#4ade80', completed: '#3b82f6', archived: '#666' };
    return colors[status] || '#888';
  };

  const getEntryTypeColor = (type) => {
    const entry = ENTRY_TYPES.find(e => e.type === type);
    return entry ? entry.color : '#888';
  };

  return (
    <>
      <Head>
        <title>Projects | Admin Console</title>
      </Head>

      <AdminLayout title="Projects">
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={styles.projectCount}>{projects.length} projects</span>
            </div>
            <button className={styles.newBtn} onClick={openNewProject}>
              <span className={styles.newIcon}>+</span>
              New Project
            </button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className={styles.loading}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className={styles.empty}>
              <p>No projects yet.</p>
              <button className={styles.newBtn} onClick={openNewProject}>
                Create your first project
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className={styles.card}
                  onClick={() => openEditProject(project)}
                >
                  <div className={styles.cardHeader}>
                    <span 
                      className={styles.cardCode}
                      style={{ color: project.accent_color }}
                    >
                      {project.code}
                    </span>
                    <span 
                      className={styles.cardStatus}
                      style={{ color: getStatusColor(project.status) }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{project.display_name_en}</h3>
                  <p className={styles.cardAlias}>{project.alias}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardCategory}>{project.category}</span>
                    <div className={styles.cardProgress}>
                      <div 
                        className={styles.cardProgressBar}
                        style={{ 
                          width: `${project.progress}%`,
                          background: project.accent_color,
                        }}
                      />
                    </div>
                    <span className={styles.cardPercent}>{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h2>
                <button className={styles.closeBtn} onClick={closeModal}>
                  &times;
                </button>
              </div>

              {/* Tabs */}
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${activeTab === 'details' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'logs' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('logs')}
                >
                  Dev Logs ({existingLogs.length + logs.length})
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'media' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('media')}
                >
                  Media ({media.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className={styles.modalContent}>
                {error && (
                  <div className={styles.error}>{error}</div>
                )}
                {success && (
                  <div className={styles.success}>{success}</div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Alias *</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={projectForm.alias}
                        onChange={(e) => handleProjectChange('alias', e.target.value)}
                        placeholder="CHAR-GEN"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Category *</label>
                      <select
                        className={styles.select}
                        value={projectForm.category}
                        onChange={(e) => handleProjectChange('category', e.target.value)}
                      >
                        {Object.entries(CATEGORY_GROUPS).map(([groupKey, group]) => (
                          <optgroup key={groupKey} label={group.label}>
                            {CATEGORIES.filter(cat => cat.group === groupKey).map(cat => (
                              <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Display Name (EN) *</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={projectForm.displayNameEn}
                        onChange={(e) => handleProjectChange('displayNameEn', e.target.value)}
                        placeholder="Character Prompt Generator"
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Display Name (ES)</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={projectForm.displayNameEs}
                        onChange={(e) => handleProjectChange('displayNameEs', e.target.value)}
                        placeholder="Generador de Prompts para Personajes"
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Description (EN)</label>
                      <textarea
                        className={styles.textarea}
                        value={projectForm.descriptionEn}
                        onChange={(e) => handleProjectChange('descriptionEn', e.target.value)}
                        placeholder="Project description..."
                        rows={3}
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Description (ES)</label>
                      <textarea
                        className={styles.textarea}
                        value={projectForm.descriptionEs}
                        onChange={(e) => handleProjectChange('descriptionEs', e.target.value)}
                        placeholder="Descripcion del proyecto..."
                        rows={3}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Status</label>
                      <select
                        className={styles.select}
                        value={projectForm.status}
                        onChange={(e) => handleProjectChange('status', e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Progress: {projectForm.progress}%</label>
                      <input
                        type="range"
                        className={styles.range}
                        min="0"
                        max="100"
                        value={projectForm.progress}
                        onChange={(e) => handleProjectChange('progress', parseInt(e.target.value))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Accent Color</label>
                      <div className={styles.colorInput}>
                        <input
                          type="color"
                          value={projectForm.accentColor}
                          onChange={(e) => handleProjectChange('accentColor', e.target.value)}
                        />
                        <span>{projectForm.accentColor}</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>External URL</label>
                      <input
                        type="url"
                        className={styles.input}
                        value={projectForm.externalUrl}
                        onChange={(e) => handleProjectChange('externalUrl', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Tech Stack</label>
                      <div className={styles.tagInput}>
                        <input
                          type="text"
                          className={styles.input}
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechTag())}
                          placeholder="Add technology..."
                        />
                        <button type="button" className={styles.addTagBtn} onClick={addTechTag}>
                          Add
                        </button>
                      </div>
                      <div className={styles.tags}>
                        {projectForm.techStack.map((tag, i) => (
                          <span key={i} className={styles.tag}>
                            {tag}
                            <button onClick={() => removeTechTag(tag)}>&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>Project Tags</label>
                      <div className={styles.tagGroups}>
                        {Object.entries(TAG_GROUPS).map(([groupKey, group]) => (
                          <div key={groupKey} className={styles.tagGroup}>
                            <span className={styles.tagGroupLabel}>{group.label}</span>
                            <div className={styles.tagOptions}>
                              {group.tags.map((tag) => (
                                <button
                                  key={tag.slug}
                                  type="button"
                                  className={`${styles.tagOption} ${projectForm.tags.includes(tag.slug) ? styles.tagSelected : ''}`}
                                  onClick={() => toggleTag(tag.slug)}
                                >
                                  {tag.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={projectForm.isFeatured}
                          onChange={(e) => handleProjectChange('isFeatured', e.target.checked)}
                        />
                        <span>Featured project</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Logs Tab */}
                {activeTab === 'logs' && (
                  <div className={styles.logsSection}>
                    {/* Existing logs (read-only) */}
                    {existingLogs.length > 0 && (
                      <div className={styles.existingLogs}>
                        <h4 className={styles.subSectionTitle}>Existing Logs</h4>
                        {existingLogs.map((log) => (
                          <div key={log.id} className={styles.existingLogCard}>
                            <span 
                              className={styles.logType}
                              style={{ color: getEntryTypeColor(log.entry_type) }}
                            >
                              {log.entry_type?.toUpperCase()}
                            </span>
                            <span className={styles.logOneLiner}>{log.one_liner}</span>
                            <span className={styles.logDate}>
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New logs */}
                    <h4 className={styles.subSectionTitle}>
                      {editingProject ? 'Add New Logs' : 'Dev Logs'}
                    </h4>
                    {logs.map((log, index) => (
                      <div key={log.id} className={styles.logCard}>
                        <div className={styles.logHeader}>
                          <span className={styles.logNumber}>Log #{index + 1}</span>
                          <button 
                            className={styles.removeBtn}
                            onClick={() => removeLog(index)}
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className={styles.logGrid}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Type</label>
                            <select
                              className={styles.select}
                              value={log.entryType}
                              onChange={(e) => updateLog(index, 'entryType', e.target.value)}
                            >
                              {ENTRY_TYPES.map(t => (
                                <option key={t.type} value={t.type}>{t.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className={styles.formGroupFull}>
                            <label className={styles.label}>One-liner (BUILD) *</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={log.oneLiner}
                              onChange={(e) => updateLog(index, 'oneLiner', e.target.value)}
                              placeholder="What did you build?"
                            />
                          </div>

                          <div className={styles.formGroupFull}>
                            <label className={styles.label}>Challenge (SOLVED)</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={log.challengeAbstract}
                              onChange={(e) => updateLog(index, 'challengeAbstract', e.target.value)}
                              placeholder="What problem did you solve?"
                            />
                          </div>

                          <div className={styles.formGroupFull}>
                            <label className={styles.label}>Mental Note (//)</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={log.mentalNote}
                              onChange={(e) => updateLog(index, 'mentalNote', e.target.value)}
                              placeholder="Personal note..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className={styles.addBtn} onClick={addLog}>
                      + Add Dev Log
                    </button>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className={styles.mediaSection}>
                    <p className={styles.mediaNote}>
                      Upload images and videos. Aspect ratios are preserved.
                    </p>
                    {media.map((m, index) => (
                      <div key={m.id} className={styles.mediaCard}>
                        <div className={styles.mediaHeader}>
                          <span className={styles.mediaNumber}>Media #{index + 1}</span>
                          <button 
                            className={styles.removeBtn}
                            onClick={() => removeMedia(index)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className={styles.mediaGrid}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Type</label>
                            <select
                              className={styles.select}
                              value={m.mediaType}
                              onChange={(e) => updateMedia(index, 'mediaType', e.target.value)}
                            >
                              {MEDIA_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          </div>

                          {['vimeo', 'youtube'].includes(m.mediaType) ? (
                            <div className={styles.formGroupFull}>
                              <label className={styles.label}>URL</label>
                              <input
                                type="url"
                                className={styles.input}
                                value={m.mediaUrl}
                                onChange={(e) => updateMedia(index, 'mediaUrl', e.target.value)}
                                placeholder="https://player.vimeo.com/video/..."
                              />
                            </div>
                          ) : (
                            <div className={styles.formGroupFull}>
                              <label className={styles.label}>File</label>
                              <input
                                type="file"
                                className={styles.fileInput}
                                accept={m.mediaType === 'gif' ? 'image/gif' : m.mediaType === 'video' ? 'video/*' : 'image/*'}
                                onChange={(e) => handleFileSelect(index, e.target.files[0])}
                              />
                              {m.mediaUrl && (
                                <div className={styles.preview}>
                                  {m.mediaType === 'video' ? (
                                    <video src={m.mediaUrl} controls />
                                  ) : (
                                    <img src={m.mediaUrl} alt="Preview" />
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <div className={styles.formGroup}>
                            <label className={styles.label}>Caption (EN)</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={m.captionEn}
                              onChange={(e) => updateMedia(index, 'captionEn', e.target.value)}
                              placeholder="Caption..."
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.label}>Caption (ES)</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={m.captionEs}
                              onChange={(e) => updateMedia(index, 'captionEs', e.target.value)}
                              placeholder="Descripcion..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className={styles.addBtn} onClick={addMedia}>
                      + Add Media
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={styles.modalFooter}>
                {editingProject && (
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleting}
                  >
                    Delete
                  </button>
                )}
                <div className={styles.footerRight}>
                  <button className={styles.cancelBtn} onClick={closeModal}>
                    Cancel
                  </button>
                  <button 
                    className={styles.saveBtn} 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div className={styles.deleteConfirm}>
                  <div className={styles.deleteConfirmContent}>
                    <h3>Delete Project?</h3>
                    <p>This will permanently delete "{editingProject?.display_name_en}" and all associated logs and media. This action cannot be undone.</p>
                    <div className={styles.deleteConfirmActions}>
                      <button 
                        className={styles.cancelBtn}
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className={styles.confirmDeleteBtn}
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting...' : 'Delete Project'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
