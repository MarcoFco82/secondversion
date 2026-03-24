import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminCV.module.css';

const TABS = [
  { key: 'personal_info', label: 'Personal Info' },
  { key: 'experience', label: 'Experience' },
  { key: 'freelance', label: 'Freelance' },
  { key: 'education', label: 'Education' },
  { key: 'skill_group', label: 'Skills' },
  { key: 'award', label: 'Awards' },
];

const SKILL_CATEGORIES = [
  { value: 'hard', label: 'Hard Skills' },
  { value: 'technical', label: 'Technical Skills' },
  { value: 'creative', label: 'Creative Skills' },
  { value: 'soft', label: 'Soft Skills' },
];

const getAuthToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('admin_token');
  return null;
};

// ========================================
// SEED DATA
// ========================================

const SEED_META = {
  en: {
    full_name: 'Marco Francisco Ramos Olvera',
    professional_title: 'Sr. Motion Graphics Designer & Creative Technologist',
    email: 'marcoramos82@zohomail.com',
    phone: '+52 5530738888',
    location: 'Guadalajara, Jalisco',
    website: 'marcomotion.com',
    bio: 'Communications graduate specialized in Advertising. 15+ years in motion graphics, post-production, and interactive media. Currently building AI-integrated creative tools and web applications. Green-yellow rank in Capoeira Regional. Bilingual (Spanish/English).',
  },
  es: {
    full_name: 'Marco Francisco Ramos Olvera',
    professional_title: 'Sr. Motion Graphics Designer & Tecnologo Creativo',
    email: 'marcoramos82@zohomail.com',
    phone: '+52 5530738888',
    location: 'Guadalajara, Jalisco',
    website: 'marcomotion.com',
    bio: 'Licenciado en Comunicacion especializado en Publicidad. 15+ anos en motion graphics, postproduccion y medios interactivos. Actualmente desarrollando herramientas creativas con IA y aplicaciones web. Cinta verde-amarilla en Capoeira Regional. Bilingue (Espanol/Ingles).',
  },
};

const SEED_SECTIONS = {
  en: [
    // Experience
    { section_type: 'experience', title: 'ENVATO Mexico', subtitle: 'Motion Graphics Designer', location: 'Guadalajara, Col. Americana', date_start: 'Feb 2018', date_end: 'Jun 2024', bullets: ['Development of commercial animations for the global market', 'Video Mockups Post-production', 'Interactive templates and tools for global marketplace', 'Code-driven animations and visual systems'], sort_order: 0 },
    { section_type: 'experience', title: 'ZU Media', subtitle: 'Production, Animation, and Post-Production Coordinator', location: 'CDMX, San Angel Inn', date_start: 'Feb 2015', date_end: 'Jan 2018', bullets: ['Main accounts: HBO, Jim Beam Suntory, Natura Mexico, Tequila Hornitos', 'Data visualization and infographic animation', 'Broadcast editing for Latin American TV', 'Documentary production for Canal 11'], sort_order: 1 },
    { section_type: 'experience', title: 'ED Escuela Digital', subtitle: 'Instructor: Video Post-Production and Digital Animation', location: 'CDMX, Paseo de la Reforma', date_start: 'Oct 2013', date_end: 'Aug 2014', bullets: ['Instructor for Post-Production and Digital Animation courses'], sort_order: 2 },
    { section_type: 'experience', title: 'Donceles 66 Foro Cultural', subtitle: 'Webmaster - Audiovisual Producer', location: 'CDMX, Centro', date_start: 'Jul 2012', date_end: 'Jan 2013', bullets: ['Web Development', 'Audiovisual Production'], sort_order: 3 },
    { section_type: 'experience', title: 'ClickOnero Mexico', subtitle: 'Motion Graphic Designer, Graphic Designer', location: 'CDMX, Polanco', date_start: 'Feb 2011', date_end: 'Nov 2011', bullets: ['Animated banners and interactive campaigns', 'Visual systems for digital marketing'], sort_order: 4 },
    { section_type: 'experience', title: 'El Salon de la Franquicia', subtitle: 'Webmaster, Designer, Audiovisual Producer', location: 'CDMX, Del Valle', date_start: 'Jun 2008', date_end: 'Jan 2011', bullets: ['Web Development', 'Design for billboards and magazines', 'Audiovisual production', 'Organizing committee member for franchise expos'], sort_order: 5 },
    { section_type: 'experience', title: 'Secretaria de Seguridad Publica y Transito Municipal', subtitle: 'Photojournalist, Department of Social Communication', location: 'Puebla City', date_start: 'Jun 2006', date_end: 'Feb 2008', bullets: ['Visual documentation and press communications', 'Photo archive management and documentation'], sort_order: 6 },
    { section_type: 'experience', title: 'Sicom TV, State of Puebla Television', subtitle: 'Video Editor and Post-Producer', location: 'Puebla, Angelopolis', date_start: '2005', date_end: '2006', bullets: ['Video editing and post-production for state television'], sort_order: 7 },
    // Freelance
    { section_type: 'freelance', title: 'marcomotion.com', subtitle: 'Creative Technologist & Fullstack Developer', location: 'Guadalajara, Remote', date_start: '2024', date_end: 'Present', bullets: ['Portfolio platform with 3D Sphere HUD (Three.js/R3F)', 'Admin panel with D1/R2/KV on Cloudflare Workers', 'AI-integrated creative tools and web applications', 'Interactive media experiments and visual systems'], sort_order: 0 },
    { section_type: 'freelance', title: 'Fundacion UNETE', subtitle: 'Animation, Web Design and Postproduction contractor', location: 'CDMX', date_start: '2014', date_end: '2014', bullets: ['Animation, Web Design and Postproduction'], sort_order: 1 },
    { section_type: 'freelance', title: 'Aluxes Ecoparque Palenque', subtitle: 'Web Designer contractor', location: 'Palenque, Chiapas', date_start: '2011', date_end: '2011', bullets: ['Web Design for eco-tourism park'], sort_order: 2 },
    { section_type: 'freelance', title: 'PGR Delegacion Puebla', subtitle: 'Corporate video producer and postproducer', location: 'Puebla', date_start: '2008', date_end: '2008', bullets: ['Corporate video production and post-production'], sort_order: 3 },
    // Education
    { section_type: 'education', title: 'Render Farm Studios', subtitle: 'Diploma in Composition for Post-production & 3D Animation', location: 'CDMX', date_start: '2011', date_end: '2011', bullets: ['Diploma in Composition for Post-production', 'Diploma in 3D Animation'], sort_order: 0 },
    { section_type: 'education', title: 'Benemerita Universidad Autonoma de Puebla', subtitle: "Bachelor's Degree in Communication Sciences, specializing in Advertising", location: 'Puebla', date_start: '2000', date_end: '2005', bullets: ['Specialization in Advertising', 'Pending Graduation'], sort_order: 1 },
    // Skills
    { section_type: 'skill_group', title: 'Hard Skills', skill_category: 'hard', items: ['Motion Graphics Design', 'Editing & Post-production', 'Video & Photography', 'Web Design', 'Fullstack Development'], sort_order: 0 },
    { section_type: 'skill_group', title: 'Technical Skills', skill_category: 'technical', items: ['After Effects', 'Premiere', 'Photoshop', 'Illustrator', 'Final Cut', 'Cinema 4D', 'Fusion', 'DaVinci Resolve', 'MidJourney', 'Runway', 'Three.js', 'React', 'Next.js', 'TypeScript', 'Cloudflare Workers', 'D1/R2/KV'], sort_order: 1 },
    { section_type: 'skill_group', title: 'Creative Skills', skill_category: 'creative', items: ['Concept development', 'Storytelling', 'Artistic design', 'Abstract animation', 'Cinematic vision', 'Visual composition'], sort_order: 2 },
    { section_type: 'skill_group', title: 'Soft Skills', skill_category: 'soft', items: ['Creative problem-solving', 'Adaptability', 'Time management', 'Collaboration', 'Attention to detail'], sort_order: 3 },
    // Awards
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2020', sort_order: 0 },
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2021', sort_order: 1 },
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2022', sort_order: 2 },
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2023', sort_order: 3 },
  ],
  es: [
    // Experience
    { section_type: 'experience', title: 'ENVATO Mexico', subtitle: 'Motion Graphics Designer', location: 'Guadalajara, Col. Americana', date_start: 'Feb 2018', date_end: 'Jun 2024', bullets: ['Desarrollo de animaciones comerciales para el mercado global', 'Postproduccion de Video Mockups', 'Templates y herramientas interactivas para marketplace global', 'Animaciones y sistemas visuales con codigo'], sort_order: 0 },
    { section_type: 'experience', title: 'ZU Media', subtitle: 'Coordinador de Produccion, Animacion y Postproduccion', location: 'CDMX, San Angel Inn', date_start: 'Feb 2015', date_end: 'Ene 2018', bullets: ['Cuentas principales: HBO, Jim Beam Suntory, Natura Mexico, Tequila Hornitos', 'Visualizacion de datos y animacion infografica', 'Edicion broadcast para TV Latinoamericana', 'Produccion documental para Canal 11'], sort_order: 1 },
    { section_type: 'experience', title: 'ED Escuela Digital', subtitle: 'Instructor: Postproduccion de Video y Animacion Digital', location: 'CDMX, Paseo de la Reforma', date_start: 'Oct 2013', date_end: 'Ago 2014', bullets: ['Instructor de cursos de Postproduccion y Animacion Digital'], sort_order: 2 },
    { section_type: 'experience', title: 'Donceles 66 Foro Cultural', subtitle: 'Webmaster - Productor Audiovisual', location: 'CDMX, Centro', date_start: 'Jul 2012', date_end: 'Ene 2013', bullets: ['Desarrollo Web', 'Produccion Audiovisual'], sort_order: 3 },
    { section_type: 'experience', title: 'ClickOnero Mexico', subtitle: 'Disenador de Motion Graphics y Disenador Grafico', location: 'CDMX, Polanco', date_start: 'Feb 2011', date_end: 'Nov 2011', bullets: ['Banners animados y campanas interactivas', 'Sistemas visuales para marketing digital'], sort_order: 4 },
    { section_type: 'experience', title: 'El Salon de la Franquicia', subtitle: 'Webmaster, Disenador, Productor Audiovisual', location: 'CDMX, Del Valle', date_start: 'Jun 2008', date_end: 'Ene 2011', bullets: ['Desarrollo Web', 'Diseno para espectaculares y revistas', 'Produccion audiovisual', 'Miembro del comite organizador de expos'], sort_order: 5 },
    { section_type: 'experience', title: 'Secretaria de Seguridad Publica y Transito Municipal', subtitle: 'Fotoperiodista, Departamento de Comunicacion Social', location: 'Ciudad de Puebla', date_start: 'Jun 2006', date_end: 'Feb 2008', bullets: ['Documentacion visual y comunicacion de prensa', 'Gestion de archivo y documentacion fotografica'], sort_order: 6 },
    { section_type: 'experience', title: 'Sicom TV, Television del Estado de Puebla', subtitle: 'Editor de Video y Postproductor', location: 'Puebla, Angelopolis', date_start: '2005', date_end: '2006', bullets: ['Edicion de video y postproduccion para television estatal'], sort_order: 7 },
    // Freelance
    { section_type: 'freelance', title: 'marcomotion.com', subtitle: 'Tecnologo Creativo & Desarrollador Fullstack', location: 'Guadalajara, Remoto', date_start: '2024', date_end: 'Presente', bullets: ['Plataforma portfolio con Sphere HUD 3D (Three.js/R3F)', 'Panel admin con D1/R2/KV en Cloudflare Workers', 'Herramientas creativas con IA y aplicaciones web', 'Experimentos de medios interactivos y sistemas visuales'], sort_order: 0 },
    { section_type: 'freelance', title: 'Fundacion UNETE', subtitle: 'Contratista de Animacion, Diseno Web y Postproduccion', location: 'CDMX', date_start: '2014', date_end: '2014', bullets: ['Animacion, Diseno Web y Postproduccion'], sort_order: 1 },
    { section_type: 'freelance', title: 'Aluxes Ecoparque Palenque', subtitle: 'Contratista de Diseno Web', location: 'Palenque, Chiapas', date_start: '2011', date_end: '2011', bullets: ['Diseno Web para parque ecoturistico'], sort_order: 2 },
    { section_type: 'freelance', title: 'PGR Delegacion Puebla', subtitle: 'Productor y postproductor de video corporativo', location: 'Puebla', date_start: '2008', date_end: '2008', bullets: ['Produccion y postproduccion de video corporativo'], sort_order: 3 },
    // Education
    { section_type: 'education', title: 'Render Farm Studios', subtitle: 'Diplomado en Composicion para Postproduccion y Animacion 3D', location: 'CDMX', date_start: '2011', date_end: '2011', bullets: ['Diplomado en Composicion para Postproduccion', 'Diplomado en Animacion 3D'], sort_order: 0 },
    { section_type: 'education', title: 'Benemerita Universidad Autonoma de Puebla', subtitle: 'Licenciatura en Ciencias de la Comunicacion, especialidad en Publicidad', location: 'Puebla', date_start: '2000', date_end: '2005', bullets: ['Especializacion en Publicidad', 'Pendiente de titulacion'], sort_order: 1 },
    // Skills
    { section_type: 'skill_group', title: 'Hard Skills', skill_category: 'hard', items: ['Diseno de Motion Graphics', 'Edicion y Postproduccion', 'Video y Fotografia', 'Diseno Web', 'Desarrollo Fullstack'], sort_order: 0 },
    { section_type: 'skill_group', title: 'Habilidades Tecnicas', skill_category: 'technical', items: ['After Effects', 'Premiere', 'Photoshop', 'Illustrator', 'Final Cut', 'Cinema 4D', 'Fusion', 'DaVinci Resolve', 'MidJourney', 'Runway', 'Three.js', 'React', 'Next.js', 'TypeScript', 'Cloudflare Workers', 'D1/R2/KV'], sort_order: 1 },
    { section_type: 'skill_group', title: 'Habilidades Creativas', skill_category: 'creative', items: ['Desarrollo de conceptos', 'Storytelling', 'Diseno artistico', 'Animacion abstracta', 'Vision cinematica', 'Composicion visual'], sort_order: 2 },
    { section_type: 'skill_group', title: 'Habilidades Blandas', skill_category: 'soft', items: ['Resolucion creativa de problemas', 'Adaptabilidad', 'Gestion del tiempo', 'Colaboracion', 'Atencion al detalle'], sort_order: 3 },
    // Awards
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2020', sort_order: 0 },
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2021', sort_order: 1 },
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2022', sort_order: 2 },
    { section_type: 'award', title: 'Envato Best Seller Award for Motion Graphics Design', date_start: '2023', sort_order: 3 },
  ],
};

// ========================================
// COMPONENT
// ========================================

export default function AdminCV() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('personal_info');
  const [meta, setMeta] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Meta form
  const [metaForm, setMetaForm] = useState({
    full_name: '', professional_title: '', email: '',
    phone: '', location: '', website: '', bio: '',
  });

  // Section form
  const emptyForm = {
    section_type: '', title: '', subtitle: '', location: '',
    date_start: '', date_end: '', description: '',
    bullets: [], skill_category: '', items: [], sort_order: 0,
  };
  const [form, setForm] = useState(emptyForm);

  // Tag input temp
  const [tagInput, setTagInput] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/cv?lang=${lang}`);
      const data = await res.json();
      if (data.success) {
        setMeta(data.data.meta);
        if (data.data.meta) {
          setMetaForm({
            full_name: data.data.meta.full_name || '',
            professional_title: data.data.meta.professional_title || '',
            email: data.data.meta.email || '',
            phone: data.data.meta.phone || '',
            location: data.data.meta.location || '',
            website: data.data.meta.website || '',
            bio: data.data.meta.bio || '',
          });
        } else {
          setMetaForm({ full_name: '', professional_title: '', email: '', phone: '', location: '', website: '', bio: '' });
        }
        const allSections = [];
        for (const [, items] of Object.entries(data.data.sections || {})) {
          allSections.push(...items);
        }
        setSections(allSections);
      }
    } catch (err) {
      console.error('Fetch CV error:', err);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const showMsg = (type, msg) => {
    if (type === 'error') setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setTagInput('');
  };

  // ---- META SAVE ----
  const saveMeta = async (e) => {
    e.preventDefault();
    if (!metaForm.full_name.trim()) { showMsg('error', 'Full name is required'); return; }
    setSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/cv/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...metaForm, lang }),
      });
      const data = await res.json();
      if (data.success) { showMsg('success', 'Personal info saved'); fetchData(); }
      else showMsg('error', data.error);
    } catch { showMsg('error', 'Network error'); }
    finally { setSaving(false); }
  };

  // ---- SECTION CRUD ----
  const saveSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = getAuthToken();
      const isEdit = !!editingId;
      const url = isEdit
        ? `/api/admin/cv/sections/${editingId}`
        : '/api/admin/cv/sections';
      const body = { ...form, section_type: form.section_type || activeTab, lang };

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showMsg('success', isEdit ? 'Updated' : 'Created');
        resetForm();
        fetchData();
      } else showMsg('error', data.error);
    } catch { showMsg('error', 'Network error'); }
    finally { setSaving(false); }
  };

  const deleteSection = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/cv/sections/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) { fetchData(); if (editingId === id) resetForm(); }
    } catch (err) { console.error('Delete error:', err); }
  };

  const editSection = (entry) => {
    setEditingId(entry.id);
    setForm({
      section_type: entry.section_type,
      title: entry.title || '',
      subtitle: entry.subtitle || '',
      location: entry.location || '',
      date_start: entry.date_start || '',
      date_end: entry.date_end || '',
      description: entry.description || '',
      bullets: Array.isArray(entry.bullets) ? entry.bullets : [],
      skill_category: entry.skill_category || '',
      items: Array.isArray(entry.items) ? entry.items : [],
      sort_order: entry.sort_order || 0,
    });
    setTagInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---- REORDER ----
  const moveSection = async (id, direction) => {
    const tabSections = filteredSections();
    const idx = tabSections.findIndex(s => s.id === id);
    if (idx < 0) return;
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= tabSections.length) return;

    const items = [
      { id: tabSections[idx].id, sort_order: tabSections[swapIdx].sort_order },
      { id: tabSections[swapIdx].id, sort_order: tabSections[idx].sort_order },
    ];

    try {
      const token = getAuthToken();
      await fetch('/api/admin/cv/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ items }),
      });
      fetchData();
    } catch (err) { console.error('Reorder error:', err); }
  };

  // ---- SEED ----
  const seedData = async () => {
    if (!confirm(`Seed CV data for both EN and ES? This will add entries (not replace existing).`)) return;
    setSeeding(true);
    try {
      const token = getAuthToken();

      for (const seedLang of ['en', 'es']) {
        // Seed meta
        await fetch('/api/admin/cv/meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ ...SEED_META[seedLang], lang: seedLang }),
        });

        // Seed sections
        for (const section of SEED_SECTIONS[seedLang]) {
          await fetch('/api/admin/cv/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...section, lang: seedLang }),
          });
        }
      }

      showMsg('success', 'Seed complete (EN + ES)');
      fetchData();
    } catch (err) {
      showMsg('error', 'Seed error: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // ---- BULLETS EDITOR ----
  const addBullet = () => setForm(f => ({ ...f, bullets: [...f.bullets, ''] }));
  const updateBullet = (i, val) => setForm(f => ({ ...f, bullets: f.bullets.map((b, idx) => idx === i ? val : b) }));
  const removeBullet = (i) => setForm(f => ({ ...f, bullets: f.bullets.filter((_, idx) => idx !== i) }));

  // ---- TAGS/ITEMS EDITOR ----
  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm(f => ({ ...f, items: [...f.items, tagInput.trim()] }));
    setTagInput('');
  };
  const removeTag = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  // ---- FILTER ----
  const filteredSections = () => {
    return sections
      .filter(s => s.section_type === activeTab)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  // ========================================
  // RENDER HELPERS
  // ========================================

  const renderMetaTab = () => (
    <form onSubmit={saveMeta} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name *</label>
          <input className={styles.input} value={metaForm.full_name} onChange={e => setMetaForm(f => ({ ...f, full_name: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Professional Title</label>
          <input className={styles.input} value={metaForm.professional_title} onChange={e => setMetaForm(f => ({ ...f, professional_title: e.target.value }))} />
        </div>
      </div>
      <div className={styles.formRow3}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} value={metaForm.email} onChange={e => setMetaForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone</label>
          <input className={styles.input} value={metaForm.phone} onChange={e => setMetaForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Website</label>
          <input className={styles.input} value={metaForm.website} onChange={e => setMetaForm(f => ({ ...f, website: e.target.value }))} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Location</label>
          <input className={styles.input} value={metaForm.location} onChange={e => setMetaForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Language</label>
          <input className={styles.input} value={lang.toUpperCase()} disabled />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Bio</label>
        <textarea className={styles.textarea} rows={3} value={metaForm.bio} onChange={e => setMetaForm(f => ({ ...f, bio: e.target.value }))} />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Personal Info'}
        </button>
      </div>
    </form>
  );

  const renderSectionForm = () => {
    const isSkill = activeTab === 'skill_group';
    const isAward = activeTab === 'award';

    return (
      <form onSubmit={saveSection} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{isSkill ? 'Group Name' : isAward ? 'Award Title' : 'Company / Institution'}</label>
            <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          {!isSkill && !isAward && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Role / Subtitle</label>
              <input className={styles.input} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
            </div>
          )}
          {isSkill && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Skill Category</label>
              <select className={styles.select} value={form.skill_category} onChange={e => setForm(f => ({ ...f, skill_category: e.target.value }))}>
                <option value="">Select...</option>
                {SKILL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          )}
        </div>

        {!isSkill && (
          <div className={styles.formRow3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input className={styles.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date Start</label>
              <input className={styles.input} value={form.date_start} onChange={e => setForm(f => ({ ...f, date_start: e.target.value }))} placeholder="Feb 2018" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{isAward ? 'Year' : 'Date End'}</label>
              <input className={styles.input} value={form.date_end} onChange={e => setForm(f => ({ ...f, date_end: e.target.value }))} placeholder={isAward ? '' : 'Jun 2024'} />
            </div>
          </div>
        )}

        {/* Bullets (experience, freelance, education) */}
        {!isSkill && !isAward && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Bullets</label>
            <div className={styles.bulletsEditor}>
              {form.bullets.map((b, i) => (
                <div key={i} className={styles.bulletRow}>
                  <input className={styles.input} value={b} onChange={e => updateBullet(i, e.target.value)} placeholder={`Bullet ${i + 1}`} />
                  <button type="button" className={styles.bulletRemoveBtn} onClick={() => removeBullet(i)}>X</button>
                </div>
              ))}
              <button type="button" className={styles.addBulletBtn} onClick={addBullet}>+ Add bullet</button>
            </div>
          </div>
        )}

        {/* Items/Tags (skills) */}
        {isSkill && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Skills</label>
            <div className={styles.tagsEditor}>
              <div className={styles.tagsDisplay}>
                {form.items.map((item, i) => (
                  <span key={i} className={styles.tagItem}>
                    {item}
                    <button type="button" className={styles.tagRemove} onClick={() => removeTag(i)}>x</button>
                  </span>
                ))}
              </div>
              <div className={styles.tagInput}>
                <input
                  className={styles.input}
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Type skill + Enter"
                />
                <button type="button" className={styles.tagAddBtn} onClick={addTag}>Add</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Sort Order</label>
          <input type="number" className={styles.input} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} style={{ width: 100 }} />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" className={styles.cancelBtn} onClick={resetForm}>Cancel</button>
          )}
        </div>
      </form>
    );
  };

  const renderEntries = () => {
    const entries = filteredSections();
    if (entries.length === 0) return <div className={styles.empty}>No entries yet. Create one above or use Seed Data.</div>;

    return (
      <div className={styles.entriesList}>
        {entries.map((entry, idx) => (
          <div key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <span className={styles.entryTitle}>{entry.title}</span>
              {entry.subtitle && <span className={styles.entrySubtitle}>{entry.subtitle}</span>}
              {(entry.date_start || entry.date_end) && (
                <span className={styles.entryDate}>
                  {entry.date_start}{entry.date_end ? ` - ${entry.date_end}` : ''}
                </span>
              )}
              {entry.location && <span className={styles.entryLocation}>{entry.location}</span>}
              <div className={styles.entryActions}>
                <button className={styles.moveBtn} disabled={idx === 0} onClick={() => moveSection(entry.id, -1)}>^</button>
                <button className={styles.moveBtn} disabled={idx === entries.length - 1} onClick={() => moveSection(entry.id, 1)}>v</button>
                <button className={styles.editBtn} onClick={() => editSection(entry)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => deleteSection(entry.id)}>Del</button>
              </div>
            </div>
            {Array.isArray(entry.bullets) && entry.bullets.length > 0 && (
              <ul className={styles.entryBullets}>
                {entry.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
            {Array.isArray(entry.items) && entry.items.length > 0 && (
              <div className={styles.entryItems}>
                {entry.items.map((item, i) => <span key={i} className={styles.skillTag}>{item}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>CV Generator | Admin Console</title>
      </Head>

      <AdminLayout title="CV Generator">
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.container}>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            {/* Top bar: lang + actions */}
            <div className={styles.topBar}>
              <div className={styles.langToggle}>
                <button
                  className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
                  onClick={() => { setLang('en'); resetForm(); }}
                >
                  EN
                </button>
                <button
                  className={`${styles.langBtn} ${lang === 'es' ? styles.langBtnActive : ''}`}
                  onClick={() => { setLang('es'); resetForm(); }}
                >
                  ES
                </button>
              </div>
              <div className={styles.topActions}>
                <button className={styles.seedBtn} onClick={seedData} disabled={seeding}>
                  {seeding ? 'Seeding...' : 'Seed Data (EN+ES)'}
                </button>
                <button className={styles.previewBtn} disabled>
                  Preview PDF (Phase 4)
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                  onClick={() => { setActiveTab(tab.key); resetForm(); }}
                >
                  {tab.label}
                  {tab.key !== 'personal_info' && (
                    <> ({sections.filter(s => s.section_type === tab.key).length})</>
                  )}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className={styles.panel}>
              {activeTab === 'personal_info' ? (
                <>
                  <h2 className={styles.sectionTitle}>Personal Info ({lang.toUpperCase()})</h2>
                  {renderMetaTab()}
                </>
              ) : (
                <>
                  <h2 className={styles.sectionTitle}>
                    {editingId ? 'Edit Entry' : 'New Entry'} — {TABS.find(t => t.key === activeTab)?.label} ({lang.toUpperCase()})
                  </h2>
                  {renderSectionForm()}
                  <hr className={styles.separator} />
                  {renderEntries()}
                </>
              )}
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
