import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  // 1. Estado para el modal y los datos de la tabla
  const [selectedMedia, setSelectedMedia] = useState(null);

  // 2. Estado para las filas de la tabla (editables desde el código)
  const [rows] = useState([
    {
      id: 0,
      column1: "Envato México",
      column2Line1: "Feb 2018 - Jun 2024",
      column2Line2: "Guadalajara, Jalisco",
      bullets: [
        "Realización de motion graphics para mercado global",
        "Implementación de código para animaciones interactivas",
        "Uso de inteligencia artificial",
      ],
      media: {
        type: "image",
        url: "/awards.webp",
      },
    },
    {
      id: 1,
      column1: "ZU Media",
      column2Line1: "Feb 2015 - Ene 2018",
      column2Line2: "CDMX, Col. San Angel Inn",
      bullets: [
        "Coordinador de Animación y Postproducción.",
        "Producción de Spots para HBO, Natura México.",
        "Animación de Infografías.",
        "Edición de Spots para Tv Latinoamericana.",
        "Edición de programa de Tv para Canal 11.",
      ],
      media: {
        type: "youtube",
        url: "https://www.youtube.com/embed/5veKZq1OXsk?si=jENuT3qe-45Tw9j2",
      },
    },
    {
      id: 2,
      column1: "ED Escuela Digital",
      column2Line1: "Oct 2012 - Ago 2014",
      column2Line2: "CDMX, Paseo de la Reforma",
      bullets: [
        "Instructor de Cursos: Postproducción de Video y Animación Digital.",

      ],
      media: {
        type: "image",
        url: "/masterclass.webp",
      },
    },
    {
      id: 4,
      column1: "Donceles 66, Foro Cultural",
      column2Line1: "Jul 2012 - Ene 2013",
      column2Line2: "CDMX, Centro Histórico",
      bullets: [
        "Webmaster",
        "Realizador Audiovisual",
      ],
      media: {
        type: "vimeo",
        url: "https://player.vimeo.com/video/57662024",
      },
    },
    {
      id: 5,
      column1: "ClickOnero México",
      column2Line1: "Feb - Nov 2011",
      column2Line2: "CDMX, Polanco",
      bullets: [
        "Diseño y animación de banners para campañas digitales.",
        "Motion Graphics.",
      ],
      media: {
        type: "vimeo",
        url: "https://player.vimeo.com/video/29595327",
      },
    },
    {
      id: 6,
      column1: "El Salón de la Franquicia",
      column2Line1: "Jun 2008 - Ene 2011",
      column2Line2: "CDMX, Col. Del Valle",
      bullets: [
        "Webmaster.",
        "Diseñador Gráfico para ads de revistas y espectaculares.",
        "Producción de cápsulas de franquicias expos.",
        "Miembro del comité organizador durante las expos de franquicias.",
      ],
      media: {
        type: "youtube",
        url: "https://www.youtube.com/embed/N4PNVg96VxE?si=l1pykLRcMlYQ7l9y",
      },
    },
    {
      id: 7,
      column1: "Secretaría de Seguridad Pública y Tránsito Municipal",
      column2Line1: "Jun 2006 - Feb 2008",
      column2Line2: "Ciudad de Puebla",
      bullets: [
        "Reportero Gráfico en el Departamento de Comunicación Social.",
        "Elaboración de nota informativa para medios locales.",
        "Fotografía policiaca y archivo fotográfico.",
      ],
      media: {
        type: "image",
        url: "/notaroja.webp",
      },
    },
    {
      id: 8,
      column1: "Sicom TV, Televisión del Estado de Puebla",
      column2Line1: "Oct 2003 - Feb 2005",
      column2Line2: "Puebla, Angelópolis",
      bullets: [
        "Editor de video y Post-productor.",
      ],
      media: {
        type: "none",
        url: "",
      },
    },
    // Agrega más filas según sea necesario...
  ]);

  // 3. Función para renderizar el modal
  const renderMediaModal = () => {
    if (!selectedMedia) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={() => setSelectedMedia(null)}>
            ×
          </button>
          {selectedMedia.type === 'image' ? (
            <img src={selectedMedia.url} alt="Modal content" />
          ) : (
            <iframe
              src={selectedMedia.url}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Head>
        <title>Marco Motion Graphics</title>
      </Head>

      {/* Banner Separador 1 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Main Div 1 */}
      <div className="main-section">
        <h1 className="title-left">MARCO<br />FRANCISCO</h1>
        <p className="text-right">
          Motion Graphics<br />
          Producción y PostProducción<br />
          Fotografía y Video<br />
          Diseño Web
        </p>
        <div className="video-container">
          <iframe
            src="https://player.vimeo.com/video/1027785578?h=b7472bc37d"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Banner Separador 2 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Main Div 2 */}
      <div className="main-section">
        <h1 className="title-right">EXPERIENCIA<br />PROFESIONAL</h1>
        <p className="text-left">
          Más de 10 años en la industria creativa.<br />
          Especializado en animación y video.
        </p>
        
        {/* Tabla con celdas editables desde el código */}
        <div className="table-container">
          <table>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {/* Columna 1 */}
                  <td className="centered">
                    {row.column1}
                  </td>

                  {/* Columna 2 */}
                  <td className="centered">
                    <div>{row.column2Line1}</div>
                    <div>{row.column2Line2}</div>
                  </td>

                  {/* Columna 3: Bullets dinámicos */}
                  <td className="bullets">
                    <ul>
                      {row.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Columna 4: Botón VER RECURSO */}
                  <td className="centered">
                    <button
                      className="resource-btn"
                      onClick={() => setSelectedMedia(row.media)}
                    >
                      VER RECURSO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banner Separador 3 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Main Div 3 */}
      <div className="main-section">
        <h1 className="title-left">CONTACTO</h1>
        <p className="text-right">marcoramos82@zohomail.com</p>
      </div>

      {/* Banner Separador 4 */}
      <div className="banner">
        <div className="marquee">
          <span>SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - EDITING - WEB DESIGN</span>
        </div>
      </div>

      {/* Main Div 4 */}
<div className="main-section">
  <h1 className="title-right">REDES<br />SOCIALES</h1>
  <div className="hyperlinks">
    <a
      href="https://www.behance.net/marcofrancisco"
      className="din-link"
      target="_blank" // Abre en una nueva pestaña
      rel="noopener noreferrer" // Mejora la seguridad
    >
      Behance
    </a>
    <a
      href="https://www.linkedin.com/in/marcofranciscoramos/"
      className="din-link"
      target="_blank" // Abre en una nueva pestaña
      rel="noopener noreferrer" // Mejora la seguridad
    >
      Linkedin
    </a>
  </div>
</div>

      {/* Footer */}
      <footer className="footer">
        <p className="final-text">Sitio desarrollado con Next.js y asistencia de ChatGPT y DeepSeek</p>
      </footer>

      {/* Modal para recursos multimedia */}
      {renderMediaModal()}
    </div>
  );
}