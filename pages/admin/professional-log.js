import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/Admin/AdminLayout';
import styles from '../../styles/AdminProfessionalLog.module.css';

const CATEGORIES = [
  { value: 'general', label: 'General', color: '#888' },
  { value: 'interactive', label: 'Interactive', color: '#06b6d4' },
  { value: 'commercial', label: 'Commercial', color: '#ffa742' },
  { value: 'tools', label: 'Tools', color: '#3b82f6' },
  { value: 'experimental', label: 'Experimental', color: '#a78bfa' },
  { value: 'storytelling', label: 'StoryTelling', color: '#ef4444' },
  { value: 'videogame', label: 'VideoGame', color: '#4ade80' },
];

const MOODS = ['Focused', 'Creative', 'Frustrated', 'Energized', 'Reflective', 'Tired'];

const getAuthToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('admin_token');
  return null;
};

const getCategoryColor = (cat) => {
  return CATEGORIES.find(c => c.value === cat)?.color || '#888';
};

export default function AdminProfessionalLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    content: '',
    category: 'general',
    project_id: '',
    mood: '',
    energy: 3,
    media_url: '',
    media_type: '',
    log_date: new Date().toISOString().split('T')[0],
  });

  // PDF date range
  const [pdfFrom, setPdfFrom] = useState('');
  const [pdfTo, setPdfTo] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/professional-logs');
      const data = await res.json();
      if (data.success) setEntries(data.data || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    // Fetch projects for dropdown
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (data.success) setProjects(data.data || []); })
      .catch(() => {});
  }, [fetchEntries]);

  const resetForm = () => {
    setForm({
      content: '',
      category: 'general',
      project_id: '',
      mood: '',
      energy: 3,
      media_url: '',
      media_type: '',
      log_date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = getAuthToken();
      const isEdit = !!editingId;
      const url = isEdit
        ? `/api/admin/professional-logs/${editingId}`
        : '/api/admin/professional-logs';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(isEdit ? 'Entry updated' : 'Entry created');
        resetForm();
        fetchEntries();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      content: entry.content,
      category: entry.category || 'general',
      project_id: entry.project_id || '',
      mood: entry.mood || '',
      energy: entry.energy || 3,
      media_url: entry.media_url || '',
      media_type: entry.media_type || '',
      log_date: entry.log_date || new Date().toISOString().split('T')[0],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/professional-logs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchEntries();
        if (editingId === id) resetForm();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const generatePDF = async () => {
    setGeneratingPdf(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Filter entries by date range
      let filtered = entries;
      if (pdfFrom) filtered = filtered.filter(e => e.log_date >= pdfFrom);
      if (pdfTo) filtered = filtered.filter(e => e.log_date <= pdfTo);
      filtered.sort((a, b) => a.log_date.localeCompare(b.log_date));

      if (filtered.length === 0) {
        setError('No entries found for the selected date range');
        setGeneratingPdf(false);
        return;
      }

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Professional Log', 20, 25);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128);
      const rangeText = pdfFrom || pdfTo
        ? `${pdfFrom || 'Start'} to ${pdfTo || 'Present'}`
        : 'All entries';
      doc.text(`Marco Francisco | ${rangeText}`, 20, 33);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 39);

      doc.setDrawColor(200);
      doc.line(20, 43, 190, 43);

      let y = 52;
      const pageHeight = 280;

      for (const entry of filtered) {
        // Check page break
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }

        // Date + category badge
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(entry.log_date, 20, y);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        const catLabel = (entry.category || 'general').toUpperCase();
        doc.text(catLabel, 60, y);

        // Mood + energy
        const meta = [];
        if (entry.mood) meta.push(entry.mood);
        if (entry.energy) meta.push(`Energy: ${entry.energy}/5`);
        if (meta.length > 0) {
          doc.text(meta.join(' | '), 120, y);
        }

        y += 7;

        // Content (word-wrapped)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40);
        const lines = doc.splitTextToSize(entry.content, 170);
        for (const line of lines) {
          if (y > pageHeight - 10) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 20, y);
          y += 5;
        }

        y += 5;

        // Separator
        doc.setDrawColor(230);
        doc.line(20, y, 190, y);
        y += 8;
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`${filtered.length} entries | marcomotion.com`, 20, pageHeight + 5);

      const filename = `professional-log${pdfFrom ? '_' + pdfFrom : ''}${pdfTo ? '_to_' + pdfTo : ''}.pdf`;
      doc.save(filename);
      setSuccess('PDF generated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF: ' + err.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <>
      <Head>
        <title>Professional Log | Admin Console</title>
      </Head>

      <AdminLayout title="Professional Log">
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.container}>
            {/* Form */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                {editingId ? 'Edit Entry' : 'New Entry'}
              </h2>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Date</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={form.log_date}
                      onChange={(e) => setForm(f => ({ ...f, log_date: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Category</label>
                    <select
                      className={styles.select}
                      value={form.category}
                      onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Project (optional)</label>
                    <select
                      className={styles.select}
                      value={form.project_id}
                      onChange={(e) => setForm(f => ({ ...f, project_id: e.target.value }))}
                    >
                      <option value="">No project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.code} — {p.display_name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Content *</label>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="What happened today? Reflections, progress, ideas..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Mood</label>
                    <select
                      className={styles.select}
                      value={form.mood}
                      onChange={(e) => setForm(f => ({ ...f, mood: e.target.value }))}
                    >
                      <option value="">Select mood...</option>
                      {MOODS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Energy: {form.energy}/5</label>
                    <input
                      type="range"
                      className={styles.range}
                      min="1"
                      max="5"
                      value={form.energy}
                      onChange={(e) => setForm(f => ({ ...f, energy: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Media URL (optional)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={form.media_url}
                      onChange={(e) => setForm(f => ({ ...f, media_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Media Type</label>
                    <select
                      className={styles.select}
                      value={form.media_type}
                      onChange={(e) => setForm(f => ({ ...f, media_type: e.target.value }))}
                    >
                      <option value="">None</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Entry' : 'Create Entry'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* PDF Generator */}
            <div className={styles.pdfSection}>
              <h2 className={styles.sectionTitle}>Generate PDF</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>From</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={pdfFrom}
                    onChange={(e) => setPdfFrom(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>To</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={pdfTo}
                    onChange={(e) => setPdfTo(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <button
                    className={styles.pdfBtn}
                    onClick={generatePDF}
                    disabled={generatingPdf || entries.length === 0}
                  >
                    {generatingPdf ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Entries List */}
            <div className={styles.entriesSection}>
              <h2 className={styles.sectionTitle}>
                Entries ({entries.length})
              </h2>

              {entries.length === 0 ? (
                <div className={styles.empty}>No entries yet. Create your first one above.</div>
              ) : (
                <div className={styles.entriesList}>
                  {entries.map((entry) => (
                    <div key={entry.id} className={styles.entryCard}>
                      <div className={styles.entryHeader}>
                        <span className={styles.entryDate}>{entry.log_date}</span>
                        <span
                          className={styles.entryCategory}
                          style={{ color: getCategoryColor(entry.category) }}
                        >
                          {(entry.category || 'general').toUpperCase()}
                        </span>
                        <div className={styles.entryMeta}>
                          {entry.mood && <span className={styles.entryMood}>{entry.mood}</span>}
                          {entry.energy && <span className={styles.entryEnergy}>E:{entry.energy}/5</span>}
                        </div>
                        <div className={styles.entryActions}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEdit(entry)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(entry.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className={styles.entryContent}>{entry.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
