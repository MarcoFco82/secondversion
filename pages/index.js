import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  // State management
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  // Professional experience data
  const [rows] = useState([
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
  ]);

  // Projects data with keywords
  const [projects] = useState([
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
        url: "https://player.vimeo.com/video/1086965653?h=c8050769c3",
      },
      imageUrl: "/project_3.jpg",
      keywords: ["Motion Graphics", "Vfx", "Design"]
    }
  ]);

  // All available keywords
  const allKeywords = [
    "Motion Graphics", "Editing", "Vfx", "Apps", "Storytelling", 
    "Web", "Frontend", "UI/UX", "Interactive Motion", "Infographics", 
    "Design", "Prototyping", "AI Image", "AI Video", "Automation Tools", 
    "Data Visualization", "Creative Coding"
  ];

  // Toggle keyword selection
  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword) 
        : [...prev, keyword]
    );
  };

  // Filter projects based on selected keywords
  const filteredProjects = selectedKeywords.length > 0
    ? projects.filter(project => 
        project.keywords.some(keyword => 
          selectedKeywords.includes(keyword)
        )
      )
    : projects;

  // Reset all selected keywords
  const resetKeywords = () => {
    setSelectedKeywords([]);
  };

  // Render media modal
  const renderMediaModal = () => {
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
            />
          ) : selectedMedia.type === 'none' ? null : (
            <iframe
              src={selectedMedia.url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Project video"
              className="modal-iframe"
            ></iframe>
          )}
        </div>
      </div>
    );
  };

  // Render keyword filter component
  const renderKeywordFilter = () => (
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
  );

// Render project grid item - CORRECTED VERSION
const renderProjectItem = (project) => (
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
);

  // Render professional experience row
  const renderExperienceRow = (row) => (
    <tr key={row.id}>
      <td className="centered">{row.column1}</td>
      <td className="centered">
        <div>{row.column2Line1}</div>
        <div>{row.column2Line2}</div>
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
            aria-label={`View resource for ${row.column1}`}
          >
            VIEW RESOURCE
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="container">
      <Head>
        <title>MarcoMotion | Professional Portfolio</title>
        <meta name="description" content="Professional portfolio of Marco Francisco - Motion Graphics Designer and Interactive Media Developer" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Banner Separator 1 */}
      <div className="banner" role="marquee">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Main Introduction Section */}
      <div className="main-section">
        <h1 className="title-left">MARCO<br />FRANCISCO</h1>
        <p className="text-right">
          Motion Graphics<br />
          Production and Post-Production<br />
          Photography and Video<br />
          Web Design
        </p>
      </div>

      {/* Banner Separator 2 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Apps & Projects Section */}
      <div className="apps-projects-section">
        <div className="main-section">
          <h1 className="title-left">APPS &<br />PROJECTS</h1>
          <p className="text-right">
            Infographics, experimental videos and short films.<br />
            The Interactive Media projects and Apps<br />
            where coded with AI assistance.<br />
          </p>
          
          {renderKeywordFilter()}
          
          {/* Projects Grid */}
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

      {/* Banner Separator 3 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Professional Experience Section */}
      <div className="main-section">
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
            {rows.map((row) => (
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
              >
                VIEW RESOURCE
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
          </table>
        </div>
      </div>

      {/* Banner Separator 4 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Contact Section */}
      {/* Contact Section */}
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

      {/* Banner Separator 5 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - INTERACTIVE MEDIA - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="main-section">
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

      {/* Footer */}
      <footer className="footer">
        <p className="final-text">© {new Date().getFullYear()} Marco Francisco. Site developed with Next.js and AI assistance.</p>
      </footer>

      {/* Modal for multimedia resources */}
      {renderMediaModal()}
    </div>
  );
}