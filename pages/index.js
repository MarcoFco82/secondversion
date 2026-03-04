import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import ParticlesBackground from '../components/ParticlesBackground.js';
import LanguageSwitcher from '../components/LanguageSwitcher';
import dynamic from 'next/dynamic';
const SphereHUD = dynamic(() => import('../components/SphereHUD/SphereHUD'), {
  ssr: false,
  loading: () => <div style={{ background: '#2a2f38', borderRadius: '12px', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', color: '#64748b' }}>Initializing 3D environment...</div>
});
import { useLanguage } from '../context/LanguageContext';
import { debounce } from 'lodash';
import GoogleAnalytics from '../components/GoogleAnalytics';
import { CATEGORY_GROUPS, getCategoriesByGroup, getCategoryBySlug } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

// Media data for professional experience (no translation needed)
const experienceMedia = [
  { type: "image", url: "/awards.jpg" },
  { type: "youtube", url: "https://www.youtube.com/embed/5veKZq1OXsk?si=jENuT3qe-45Tw9j2" },
  { type: "image", url: "/masterclass.jpg" },
  { type: "none", url: "" },
  { type: "vimeo", url: "https://player.vimeo.com/video/57662024" },
  { type: "vimeo", url: "https://player.vimeo.com/video/29595327" },
  { type: "youtube", url: "https://www.youtube.com/embed/N4PNVg96VxE?si=l1pykLRcMlYQ7l9y" },
  { type: "image", url: "/notaroja.jpg" },
  { type: "none", url: "" }
];

export default function Home() {
  const { t, language } = useLanguage();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedProjectMedia, setSelectedProjectMedia] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [shape, setShape] = useState("circle");
  const [size, setSize] = useState(4);
  const [speed, setSpeed] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);
  const [showExperienceSection, setShowExperienceSection] = useState(false);
  const [expandedExperienceId, setExpandedExperienceId] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  // Projects from API
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [slideshowInterval, setSlideshowInterval] = useState(4);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && data.data) {
          // Transform API data to component format
          const transformed = data.data.map(p => ({
            id: p.id,
            code: p.code,
            alias: p.alias,
            displayName: {
              en: p.display_name_en,
              es: p.display_name_es || p.display_name_en,
            },
            description: {
              en: p.description_en ? [p.description_en] : [],
              es: p.description_es ? [p.description_es] : [],
            },
            accentColor: p.accent_color || '#ffa742',
            thumbnailUrl: p.thumbnail_url,
            featuredMediaUrl: p.featured_media_url,
            featuredMediaType: p.featured_media_type,
            category: p.category,
            status: p.status,
            progress: p.progress,
            techStack: p.tech_stack ? JSON.parse(p.tech_stack) : [],
            tags: p.tags ? JSON.parse(p.tags) : [],
            keywords: p.tags ? JSON.parse(p.tags) : [],
            externalUrl: p.external_url,
            isFeatured: p.is_featured === 1,
            // Include media array for slideshow
            media: (p.media || []).map(m => ({
              id: m.id,
              type: m.media_type,
              url: m.media_url,
              caption: m.caption_en || m.caption_es || '',
            })),
          }));
          setProjects(transformed);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch slideshow interval from sphere config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/sphere-config');
        const data = await res.json();
        if (data.success && data.data?.slideshowInterval) {
          setSlideshowInterval(data.data.slideshowInterval);
        }
      } catch (err) {
        // Keep default
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const debouncedResize = debounce(checkMobile, 250);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  // Get all keywords from projects
  const allKeywords = useMemo(() => {
    const tagSet = new Set();
    projects.forEach(p => {
      p.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [projects]);

  // Derive active categories from real projects
  const activeCategories = useMemo(() => {
    const catSet = new Set();
    projects.forEach(p => {
      if (p.category) catSet.add(p.category);
    });
    return catSet;
  }, [projects]);

  // Filter projects by category + keywords
  const filteredProjects = useMemo(() => {
    let result = projects;
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (selectedKeywords.length > 0) {
      result = result.filter(p =>
        p.tags?.some(tag => selectedKeywords.includes(tag))
      );
    }
    return result;
  }, [projects, selectedCategory, selectedKeywords]);

  const toggleKeyword = useCallback((keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword) 
        : [...prev, keyword]
    );
  }, []);

  const resetKeywords = useCallback(() => {
    setSelectedKeywords([]);
  }, []);

  const handleCategorySelect = useCallback((slug) => {
    setSelectedCategory(slug);
  }, []);

  const handlePasswordSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (password.toLowerCase() === 'caputdraconis') {
      setShowExperienceSection(true);
      setShowPasswordModal(false);
      setPasswordError(false);
      setPassword('');
      setExpandedExperienceId(0);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  }, [password]);
  
  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  }, []);

  const handleOpenPasswordModal = useCallback(() => {
    setShowPasswordModal(true);
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError(false);
  }, []);

  const toggleExperience = useCallback((id) => {
    setExpandedExperienceId(prev => prev === id ? null : id);
  }, []);

  // Close modal and reset media
  const closeMediaModal = useCallback(() => {
    setSelectedMedia(null);
    setSelectedProjectMedia([]);
  }, []);

  const renderMediaModal = useCallback(() => {
    if (!selectedMedia) return null;

    const accentColor = selectedMedia.accentColor || '#ffa742';
    const hasGallery = selectedProjectMedia.length > 1;

    return (
      <div className="modal-overlay" onClick={closeMediaModal}>
        <div 
          className="modal-content project-modal" 
          onClick={(e) => e.stopPropagation()}
          style={{ '--accent-color': accentColor }}
        >
          <button 
            className="close-btn" 
            onClick={closeMediaModal}
            aria-label="Close modal"
          >
            x
          </button>
          
          {/* Project Header */}
          {selectedMedia.projectName && (
            <div className="modal-project-header">
              <h3 style={{ color: accentColor }}>{selectedMedia.projectName}</h3>
            </div>
          )}
          
          {/* Main Media */}
          {(selectedMedia.type === 'image' || selectedMedia.type === 'gif') && selectedMedia.url && (
            <img 
              src={selectedMedia.url} 
              alt={selectedMedia.projectName || "Resource"}
              className="modal-media"
              loading="lazy"
            />
          )}
          {selectedMedia.type === 'video' && selectedMedia.url && (
            <video 
              src={selectedMedia.url}
              className="modal-media modal-video"
              controls
              autoPlay
              loop
              muted
            />
          )}
          {(selectedMedia.type === 'youtube' || selectedMedia.type === 'vimeo') && selectedMedia.url && (
            <iframe 
              src={selectedMedia.url}
              className="modal-iframe"
              allow="autoplay; fullscreen"
              loading="lazy"
            />
          )}
          
          {/* No media fallback */}
          {!selectedMedia.url && (
            <div className="modal-no-media">
              <span style={{ color: accentColor }}>No media available</span>
            </div>
          )}
          
          {/* Project Gallery Thumbnails */}
          {hasGallery && (
            <div className="modal-gallery">
              {selectedProjectMedia.map((media, idx) => (
                <button
                  key={media.id || idx}
                  className={`gallery-thumb ${selectedMedia.url === media.url ? 'active' : ''}`}
                  onClick={() => setSelectedMedia(prev => ({
                    ...prev,
                    type: media.type,
                    url: media.url,
                  }))}
                  style={{ borderColor: selectedMedia.url === media.url ? accentColor : 'transparent' }}
                >
                  {(media.type === 'image' || media.type === 'gif') ? (
                    <img src={media.url} alt={media.caption || `Media ${idx + 1}`} />
                  ) : (
                    <div className="gallery-thumb-video">
                      <span>▶</span>
                      <span className="thumb-type">{media.type?.toUpperCase()}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }, [selectedMedia, selectedProjectMedia, closeMediaModal]);

  const handleProjectClick = useCallback((project, displayName) => {
    setSelectedMedia({
      type: project.featuredMediaType || (project.media?.[0]?.type),
      url: project.featuredMediaUrl || (project.media?.[0]?.url),
      projectId: project.id,
      projectName: displayName,
      accentColor: project.accentColor,
    });
    setSelectedProjectMedia(project.media || []);
  }, []);

  const renderCategoryFilter = useCallback(() => (
    <div className="category-filter-container">
      <div className="category-filter-header">
        <h3>{t.categoryFilterTitle}</h3>
        {selectedCategory !== 'all' && (
          <button onClick={() => handleCategorySelect('all')} className="reset-keywords-btn">
            {t.resetFiltersBtn}
          </button>
        )}
      </div>
      <div className="category-groups">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategorySelect('all')}
        >
          {t.allCategoriesBtn}
        </button>
        {Object.entries(CATEGORY_GROUPS).map(([groupKey, group]) => {
          const groupCats = getCategoriesByGroup(groupKey).filter(cat => activeCategories.has(cat.slug));
          if (groupCats.length === 0) return null;
          return (
            <div key={groupKey} className="category-group">
              <span className="category-group-label" style={{ color: group.color }}>{language === 'es' ? group.labelEs : group.label}</span>
              <div className="category-group-buttons">
                {groupCats.map(cat => (
                  <button
                    key={cat.slug}
                    className={`category-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                    style={{
                      borderColor: group.color,
                      ...(selectedCategory === cat.slug ? { backgroundColor: group.color, color: '#1a1f27' } : { color: group.color }),
                    }}
                    onClick={() => handleCategorySelect(cat.slug)}
                  >
                    {language === 'es' ? cat.labelEs : cat.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ), [selectedCategory, activeCategories, handleCategorySelect, language, t]);

  const renderKeywordFilter = useCallback(() => (
    <div className="keyword-filter-container">
      <div className="keyword-filter-header">
        <h3>{t.filterTitle}</h3>
        {selectedKeywords.length > 0 && (
          <button onClick={resetKeywords} className="reset-keywords-btn">
            {t.resetFiltersBtn}
          </button>
        )}
      </div>
      <div className="keyword-tags-container">
        {allKeywords.map((keyword) => (
          <button
            key={keyword}
            onClick={() => toggleKeyword(keyword)}
            className={`keyword-tag ${selectedKeywords.includes(keyword) ? 'active' : ''}`}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  ), [selectedKeywords, resetKeywords, toggleKeyword, t]);

  const renderExperienceSection = useCallback(() => (
    <div className="experience-section">
      {!showExperienceSection ? (
        <button 
          className="toggle-experience-btn"
          onClick={handleOpenPasswordModal}
        >
          {t.viewExperienceBtn}
        </button>
      ) : (
        <div className="experience-accordion">
          {t.experience.map((exp, index) => {
            const media = experienceMedia[index];
            return (
              <div key={exp.id} className="experience-item">
                <div 
                  className="experience-header"
                  onClick={() => toggleExperience(exp.id)}
                >
                  <div className="company-info">
                    <h3>{exp.company}</h3>
                    <p className="company-location">{exp.location}</p>
                  </div>
                  <span className="toggle-icon">
                    {expandedExperienceId === exp.id ? '−' : '+'}
                  </span>
                </div>
                
                {expandedExperienceId === exp.id && (
                  <div className="experience-content">
                    <ul className="experience-bullets">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                    {media && media.type !== 'none' && (
                      <button
                        className="resource-btn"
                        onClick={() => setSelectedMedia(media)}
                      >
                        {t.viewResourceBtn}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  ), [showExperienceSection, expandedExperienceId, toggleExperience, handleOpenPasswordModal, t]);

  return (
    <div className="container">
      <Head>
        <GoogleAnalytics />
        <title>MarcoMotion | Professional Portfolio</title>
        <meta name="description" content="Marco Francisco - Creative Technologist building interactive experiences with code, animation, and AI" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="MarcoMotion | Professional Portfolio" />
        <meta property="og:description" content="Creative Technologist - Code, Animation & AI Integration" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marcomotion.com" />
      </Head>

      <ParticlesBackground theme="light" layer="banner" key="banner-particles" />
      <div className="banner" role="marquee">
        <div className="marquee">
          <span>{t.banner}</span>
        </div>
      </div>

      <div className="main-section">
        <div className="particle-container">
          <ParticlesBackground theme="light" size={size} speed={speed} key="intro-particles" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <h1 className="title-left">
            {t.mainTitle.line1}<a 
              href="https://layergen.marcomotion.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="name-link"
            >O</a><br />
            {t.mainTitle.line2}<a 
              href="https://photogen.marcomotion.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="name-link"
            >O</a>
          </h1>
          <LanguageSwitcher />
        </div>
        <p className="text-right">
          {t.mainDescription.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < t.mainDescription.length - 1 && <br />}
            </span>
          ))}
        </p>

        <div className="full-width-vimeo">
          <iframe 
            src="https://player.vimeo.com/video/1115649422?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            title="MarcoMotion"
            loading="lazy"
          ></iframe>
        </div>

      </div>

      {/* SPHERE HUD - Full width, fuera de main-section */}
      <SphereHUD lang={language} />

      <div className="particle-container">
        <ParticlesBackground theme="light" size={size} speed={speed} key="intro-particles-2" />
      </div>
      <div className="banner">
        <div className="marquee">
          <span>{t.banner}</span>
        </div>
      </div>

      <div className="apps-projects-section">
        <div className="main-section">
          <h1 className="title-left">{t.projectsTitle}</h1>
          <p className="text-right">
            {t.projectsDescription.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < t.projectsDescription.length - 1 && <br />}
              </span>
            ))}
          </p>
          
          {renderCategoryFilter()}
          {renderKeywordFilter()}

          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  language={language}
                  slideshowInterval={slideshowInterval}
                  onProjectClick={handleProjectClick}
                />
              ))
            ) : (
              <div className="no-projects-message">
                <p>{t.noProjectsMessage}</p>
                <button 
                  onClick={resetKeywords}
                  className="reset-keywords-btn"
                >
                  {t.resetFiltersBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ParticlesBackground theme="light" layer="banner" key="banner-particles-3" />
      <div className="banner">
        <div className="marquee">
          <span>{t.banner}</span>
        </div>
      </div>

      <div className="main-section">
        <ParticlesBackground theme="light" size={size} speed={speed} key="experience-particles" />
        <h1 className="title-right">{t.experienceTitle}</h1>
        <p className="text-left">
          {t.experienceDescription.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < t.experienceDescription.length - 1 && <br />}
            </span>
          ))}
        </p>
        
        {renderExperienceSection()}
      </div>

      <ParticlesBackground theme="light" layer="banner" key="banner-particles-4" />
      <div className="banner">
        <div className="marquee">
          <span>{t.banner}</span>
        </div>
      </div>

      <div className="maincontact-section">
        <div className="container">
          <h1 className="title-left">{t.contactTitle}</h1>
          <p className="text-right">
            <a href="mailto:contacto@marcomotion.com" className="email-link">
              contacto@marcomotion.com
            </a>
          </p>
        </div>
      </div>

      <ParticlesBackground theme="light" layer="banner" key="banner-particles-5" />
      <div className="banner">
        <div className="marquee">
          <span>{t.banner}</span>
        </div>
      </div>

      <div className="main-section">
        <ParticlesBackground theme="light" size={size} speed={speed} key="social-particles" />
        <h1 className="title-right">{t.socialTitle}</h1>
        <div className="hyperlinks">
          <a
            href="https://www.behance.net/marcofrancisco"
            className="din-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Behance profile"
          >
            Behance
          </a>
          <a
            href="https://www.linkedin.com/in/marcofranciscoramos/"
            className="din-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
          <a
            href="https://vimeo.com/marcomotion"
            className="din-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vimeo profile"
          >
            Vimeo
          </a>
        </div>
      </div>

      <footer className="footer">
        <p className="final-text">
          © {new Date().getFullYear()} Marco Francisco. {t.footer}
          <a href="/admin/login" className="admin-link" title="Admin">●</a>
        </p>
      </footer>

      {renderMediaModal()}
      
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content password-modal">
            <button 
              className="close-btn" 
              onClick={handleClosePasswordModal}
              aria-label="Close password modal"
            >
              ×
            </button>
            <h3>{t.passwordModal.title}</h3>
            <p>{t.passwordModal.description}</p>
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder={t.passwordModal.placeholder}
                className={`password-input ${passwordError ? 'error' : ''}`}
                autoFocus
              />
              {passwordError && (
                <p className="password-error">{t.passwordModal.errorMessage}</p>
              )}
              <button type="submit" className="password-submit-btn">
                {t.passwordModal.submitBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
