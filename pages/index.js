import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import ParticlesBackground from '../components/ParticlesBackground.js';
import { debounce } from 'lodash';
import GoogleAnalytics from '../components/GoogleAnalytics';

const professionalExperience = [
  {
    id: 0,
    company: "Envato México",
    location: "Guadalajara, Jalisco",
    bullets: [
      "Motion graphics production for global market.",
      "Code implementation for interactive animations.",
      "Artificial intelligence integration.",
    ],
    media: {
      type: "image",
      url: "/awards.jpg",
    },
  },
  {
    id: 1,
    company: "ZU Media",
    location: "Mexico City, Col. San Angel Inn",
    bullets: [
      "Animation and Post-Production Coordinator.",
      "Spots production for HBO, Natura México, Jim Beam.",
      "Infographic animation.",
      "Spots editing for Latin American TV.",
      "TV documentary program editing for Canall 11.",
    ],
    media: {
      type: "youtube",
      url: "https://www.youtube.com/embed/5veKZq1OXsk?si=jENuT3qe-45Tw9j2",
    },
  },
  {
    id: 2,
    company: "ED Escuela Digital",
    location: "Mexico City, Paseo de la Reforma",
    bullets: [
      "Video Post-Production and Digital Animation courses instructor.",
    ],
    media: {
      type: "image",
      url: "/masterclass.jpg",
    },
  },
  {
    id: 4,
    company: "Donceles 66, Cultural Forum.",
    location: "Mexico City, Historic Center.",
    bullets: [
      "Webmaster.",
      "Audiovisual Producer.",
    ],
    media: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/57662024",
    },
  },
  {
    id: 5,
    company: "ClickOnero México",
    location: "Mexico City, Polanco",
    bullets: [
      "Design and animation of banners for digital campaigns.",
      "Motion Graphics.",
    ],
    media: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/29595327",
    },
  },
  {
    id: 6,
    company: "El Salón de la Franquicia",
    location: "Mexico City, Col. Del Valle",
    bullets: [
      "Webmaster.",
      "Graphic Designer for magazine ads and billboards.",
      "Production of franchises expos videos.",
      "Member of the organizing committee for franchises expos.",
    ],
    media: {
      type: "youtube",
      url: "https://www.youtube.com/embed/N4PNVg96VxE?si=l1pykLRcMlYQ7l9y",
    },
  },
  {
    id: 7,
    company: "Secretaría de Seguridad Pública y Tránsito Municipal",
    location: "Puebla City",
    bullets: [
      "Graphic Reporter for the Social Communication Department.",
      "Press release writing for local media.",
      "Police photography and photo archive management.",
    ],
    media: {
      type: "image",
      url: "/notaroja.jpg",
    },
  },
  {
    id: 8,
    company: "Sicom TV, State of Puebla Television",
    location: "Puebla, Angelópolis",
    bullets: [
      "Video Editor and Post-Producer.",
    ],
    media: {
      type: "none",
      url: "",
    },
  },
];

const projectsData = [
  {
    id: 1,
    title: "Character Prompt Generator",
    description: [
      "Built to make character creation easy",
      "with total control over the look and feel,",
      "crafting unique, consistent styles."
    ],
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
    title: "Scripts for Data Visualization in After Effects",
    description: [
      "Custom AE scripts to automate",
      "charts, graphs, and infographics."
    ],
    media: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/1086598671?h=5e6b68bdc7",
    },
    imageUrl: "/project_2.jpg",
    keywords: ["Web", "Interactive Motion", "Creative Coding"]
  },
  {
    id: 3,
    title: "Intro Logos Reel",
    description: [
      "Animated logo intros and social reels",
      "designed for modern brands and creators,",
      "ready for instant use and customization."
    ],
    media: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/1106568526",
    },
    imageUrl: "/project_3.jpg",
    keywords: ["Motion Graphics", "Vfx", "Design"]
  },
  {
    id: 4,
    title: "AI Short: Book Trailer",
    description: [
      "Book Trailer no. 2 realizado para el",
      "libro de Mónica Rojas: A la sombra",
      "de un árbol muerto."
    ],
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
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [shape, setShape] = useState("circle");
  const [size, setSize] = useState(4);
  const [speed, setSpeed] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);

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

  const renderMediaModal = useCallback(() => {
    if (!selectedMedia) return null;
  
    if (selectedMedia.behavior === "new_tab") {
      window.open(selectedMedia.url, '_blank', 'noopener,noreferrer');
      return null;
    }
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button 
            className="close-btn" 
            onClick={() => setSelectedMedia(null)}
            aria-label="Close modal"
          >
            ×
          </button>
          {selectedMedia.type === 'image' ? (
            <img 
              src={selectedMedia.url} 
              alt="Project showcase" 
              className="modal-media"
              loading="lazy"
            />
          ) : selectedMedia.type === 'none' ? null : (
            <iframe
              src={selectedMedia.url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Project video"
              className="modal-iframe"
              loading="lazy"
            ></iframe>
          )}
        </div>
      </div>
    );
  }, [selectedMedia]);

  const renderKeywordFilter = useCallback(() => (
    <div className="keyword-filter-container">
      <div className="keyword-filter-header">
        <h3>Filter Projects:</h3>
        {selectedKeywords.length > 0 && (
          <button onClick={resetKeywords} className="reset-keywords-btn">
            Reset Filters
          </button>
        )}
      </div>
      <div className="keyword-tags-container">
        {allKeywords.map(keyword => (
          <button
            key={keyword}
            className={`keyword-tag ${selectedKeywords.includes(keyword) ? 'active' : ''}`}
            onClick={() => toggleKeyword(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  ), [selectedKeywords, resetKeywords, toggleKeyword]);

  const renderProjectItem = useCallback((project) => (
    <div key={project.id} className="project-item">
      <div 
        className="project-image"
        onClick={() => setSelectedMedia(project.media)}
        style={{ backgroundImage: `url(${project.imageUrl})` }}
        role="img"
        aria-label={`Preview of ${project.title} project`}
      >
        <img 
          src={project.imageUrl} 
          alt={project.title}
          style={{ display: 'none' }}
          loading="lazy"
        />
      </div>
      <div className="project-info">
        <h3>{project.title}</h3>
        <div className="project-description">
          {project.description.map((line, index) => (
            <p key={index} className="description-line">{line}</p>
          ))}
        </div>
        <div className="project-keywords">
          {project.keywords?.map(keyword => (
            <span key={keyword} className="keyword-badge">{keyword}</span>
          ))}
        </div>
      </div>
    </div>
  ), []);

  const renderExperienceRow = useCallback((row) => (
    <tr key={row.id}>
      <td className="centered">
        <div className="company-name">{row.company}</div>
        <div className="company-location">{row.location}</div>
      </td>
      <td className="bullets">
        <ul>
          {row.bullets.map((bullet, bulletIndex) => (
            <li key={bulletIndex}>{bullet}</li>
          ))}
        </ul>
      </td>
      <td className="centered">
        {row.media.type !== 'none' && (
          <button
            className="resource-btn"
            onClick={() => setSelectedMedia(row.media)}
            aria-label={`View resource for ${row.company}`}
          >
            VIEW RESOURCE
          </button>
        )}
      </td>
    </tr>
  ), []);

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
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      <div className="main-section">
      <div className="particle-container">
    <ParticlesBackground theme="light" size={size} speed={speed} key="intro-particles" />
  </div>
        <h1 className="title-left">
          MARC<a 
            href="https://layergen.marcomotion.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="name-link"
          >O</a><br />
          FRANCISC<a 
            href="https://photogen.marcomotion.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="name-link"
          >O</a>
        </h1>
        <p className="text-right">
          Motion Graphics<br />
          Production and Post-Production<br />
          Photography and Video<br />
          Web Design
        </p>

        {/* MARCO MOTION */}
  <div className="vimeo-container">
    <iframe 
      src="https://player.vimeo.com/video/1115649422?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
      width="100%" 
      height="100%" 
      frameBorder="0" 
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
      referrerPolicy="strict-origin-when-cross-origin" 
      title="MarcoMotion"
      loading="lazy"
    ></iframe>
  </div>

      </div>

      <div className="particle-container">
    <ParticlesBackground theme="light" size={size} speed={speed} key="intro-particles" />
  </div>
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      <div className="apps-projects-section">
     
        <div className="main-section">
          <h1 className="title-left">APPS &<br />PROJECTS</h1>
          <p className="text-right">
            Infographics, experimental videos and short films.<br />
            The Interactive Media projects and Apps<br />
            where coded with AI assistance.<br />
          </p>
          
          {renderKeywordFilter()}
          
          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(renderProjectItem)
            ) : (
              <div className="no-projects-message">
                <p>No projects match the selected filters.</p>
                <button 
                  onClick={resetKeywords}
                  className="reset-keywords-btn"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ParticlesBackground theme="light" layer="banner" key="banner-particles-3" />
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      <div className="main-section">
        <ParticlesBackground theme="light" size={size} speed={speed} key="experience-particles" />
        <h1 className="title-right">PROFESSIONAL<br />EXPERIENCE</h1>
        <p className="text-left">
          Over 15 years in the creative industry.<br />
          Specialized in animation and video.
        </p>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Responsibilities</th>
                <th>Media</th>
              </tr>
            </thead>
            <tbody>
              {professionalExperience.map(renderExperienceRow)}
            </tbody>
          </table>
        </div>
      </div>

      <ParticlesBackground theme="light" layer="banner" key="banner-particles-4" />
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      <div className="maincontact-section">
        <div className="container">
          <h1 className="title-left">CONTACT</h1>
          <p className="text-right">
            <a href="mailto:markof.render@gmail.com" className="email-link">
              markof.render@gmail.com
            </a>
          </p>
        </div>
      </div>

      <ParticlesBackground theme="light" layer="banner" key="banner-particles-5" />
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      <div className="main-section">
        <ParticlesBackground theme="light" size={size} speed={speed} key="social-particles" />
        <h1 className="title-right">SOCIAL<br />MEDIA</h1>
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
            href="https://vimeo.com/marcofrancisco"
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
        <p className="final-text">© {new Date().getFullYear()} Marco Francisco. Site developed with Next.js and AI assistance.</p>
      </footer>

      {renderMediaModal()}
    </div>
  );
}