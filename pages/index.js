import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import ParticlesBackground from '../components/ParticlesBackground.js';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { debounce } from 'lodash';
import GoogleAnalytics from '../components/GoogleAnalytics';

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

const projectsData = [
  {
    id: 1,
    media: {
      type: "url",
      url: "https://chargen.marcomotion.com/",
      behavior: "new_tab"
    },
    imageUrl: "/project_1.png",
    keywords: ["Apps", "Frontend", "UI/UX", "AI Image"]
  },
  {
    id: 2,
    media: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/1086598671?h=5e6b68bdc7",
    },
    imageUrl: "/project_2.jpg",
    keywords: ["Web", "Interactive Motion", "Creative Coding"]
  },
  {
    id: 3,
    media: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/1086965653",
    },
    imageUrl: "/project_3.jpg",
    keywords: ["Motion Graphics", "Vfx", "Design"]
  },
  {
    id: 4,
    media: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/1106568526",
    },
    imageUrl: "/project_4.jpg",
    keywords: ["AI Video", "Editing", "Storytelling"]
  }
];

const allKeywords = [
  "Motion Graphics", "Editing", "Vfx", "Apps", "Storytelling", 
  "Web", "Frontend", "UI/UX", "Interactive Motion", "Infographics", 
  "Design", "Prototyping", "AI Image", "AI Video", "Automation Tools", 
  "Data Visualization", "Creative Coding"
];

export default function Home() {
  const { t } = useLanguage();
  const [selectedMedia, setSelectedMedia] = useState(null);
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const debouncedResize = debounce(checkMobile, 250);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  const filteredProjects = useMemo(() => {
    return selectedKeywords.length > 0
      ? projectsData.filter(project => 
          project.keywords.some(keyword => 
            selectedKeywords.includes(keyword)
          )
        )
      : projectsData;
  }, [selectedKeywords]);

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

  const renderMediaModal = useCallback(() => {
    if (!selectedMedia) return null;

    return (
      <div className="modal-overlay" onClick={() => setSelectedMedia(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button 
            className="close-btn" 
            onClick={() => setSelectedMedia(null)}
            aria-label="Close modal"
          >
            ×
          </button>
          {selectedMedia.type === 'image' && (
            <img 
              src={selectedMedia.url} 
              alt="Resource" 
              className="modal-media"
              loading="lazy"
            />
          )}
          {(selectedMedia.type === 'youtube' || selectedMedia.type === 'vimeo') && (
            <iframe 
              src={selectedMedia.url}
              className="modal-iframe"
              allow="autoplay; fullscreen"
              loading="lazy"
            />
          )}
        </div>
      </div>
    );
  }, [selectedMedia]);

  const renderProjectItem = useCallback((project) => {
    const projectTranslation = t.projects.find(p => p.id === project.id);
    
    const handleProjectClick = () => {
      if (project.media.type === 'url' && project.media.behavior === 'new_tab') {
        window.open(project.media.url, '_blank', 'noopener,noreferrer');
      } else {
        setSelectedMedia(project.media);
      }
    };

    return (
      <div key={project.id} className="project-item">
        <div 
          className="project-image" 
          style={{ backgroundImage: `url(${project.imageUrl})` }}
          onClick={handleProjectClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleProjectClick()}
        />
        <div className="project-info">
          <h3>{projectTranslation?.title || project.title}</h3>
          <div className="project-description">
            {(projectTranslation?.description || project.description).map((line, idx) => (
              <p key={idx} className="description-line">{line}</p>
            ))}
          </div>
          <div className="project-keywords">
            {project.keywords.map((keyword, idx) => (
              <span key={idx} className="keyword-badge">{keyword}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }, [t]);

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
            const isExpanded = expandedExperienceId === exp.id;
            const media = experienceMedia[index];
            
            return (
              <div key={exp.id} className="experience-item">
                <div 
                  className="experience-header"
                  onClick={() => toggleExperience(exp.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && toggleExperience(exp.id)}
                >
                  <div className="company-info">
                    <h3 className="company-name">{exp.company}</h3>
                    <span className="company-location">{exp.location}</span>
                  </div>
                  <span className="toggle-icon">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
                
                {isExpanded && (
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
        <meta name="description" content="Professional portfolio of Marco Francisco - Motion Graphics Designer and Interactive Media Developer" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="MarcoMotion | Professional Portfolio" />
        <meta property="og:description" content="Motion Graphics Designer and Interactive Media Developer" />
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
          
          {renderKeywordFilter()}
          
          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(renderProjectItem)
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
        <p className="final-text">© {new Date().getFullYear()} Marco Francisco. {t.footer}</p>
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
