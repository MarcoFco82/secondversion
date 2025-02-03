import React, { useState, useEffect, useRef } from 'react'; // Importa useState
import Banner from '../components/Banner'; // Importa el componente Banner
import styles from '../styles/Home.module.css'; // Importa los estilos de la página Home

const formatYouTubeUrl = (url) => {
  const videoId = url.split('/').pop(); // Extrae el ID del video
  return `https://www.youtube.com/embed/${videoId}`;
};

export default function Home() {
  const data = [
    {
      title: "MARCO FRANCISCO",
      text: "Motion Graphics\nProducción y PostProducción\nFotografía y Video\nDiseño Web",
      bannerText: "SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - WEB DESIGN",
    },
    {
      title: "EXPERIENCIA PROFESIONAL",
      text: "Más de 10 años en la industria creativa.\nEspecializado en animación y video.",
      bannerText: "SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - WEB DESIGN",
    },
    {
      title: "CONTACTO",
      text: "marcoramos82@zohomail.com",
      bannerText: "SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - WEB DESIGN",
    },
    {
      title: "REDES SOCIALES",
      text: "",
      bannerText: "SR. MOTION GRAPHICS DESIGNER - VIDEO PRODUCTION - GRAPHIC DESIGN - POST-PRODUCTION - WEB DESIGN",
    },
  ];

  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [resourceUrl, setResourceUrl] = useState(""); // Estado para la URL del recurso

  const openModal = (url) => {
    setResourceUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResourceUrl("");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.remove("hidden");
          } else {
            entry.target.classList.remove("visible");
            entry.target.classList.add("hidden");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll("h1, p");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={containerRef}>
      {data.map((item, index) => {
        const isOdd = index % 2 === 0;
        const words = item.title.split(" ");

        return (
          <div key={index}>
            <Banner text={item.bannerText} />

            <h1 className={isOdd ? "title-odd" : "title-even"}>
              {words[0]} <br /> {words[1]}
            </h1>

            <p className={isOdd ? "paragraph-odd" : "paragraph-even"}>
              {item.text.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>

            {index === 0 && (
              <div style={{ position: 'relative', overflow: 'hidden', margin: '0 auto', maxWidth: '1200px' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', marginBottom: '20px' }}>
                  <iframe
                    src="https://player.vimeo.com/video/1027785578?h=b7472bc37d"
                    width="640"
                    height="564"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            )}

            

            {index === 1 && (
              <div className={styles.centeredContainer}>
                <div className={styles.tableWrapper}>
                  <div className={styles.tableContainer}>
                    <table className={styles.experienceTable}>
                      <thead>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className={styles.experienceText}>
                        <tr>
                          <td>Envato</td>
                          <td></td>
                          <td>Guadalajara, Jalisco<br /> Feb2018-Jun2024</td>
                          <td>
                            <ul>
                              <li>Realización de motion graphics</li>
                              <li>Implementación de código para animaciones interactivas</li>
                              <li>Uso de inteligencia artificial</li>
                            </ul>
                          </td>
                          <td>
                            <button
                              onClick={() => openModal("/awards.webp")} // URL del recurso
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              VER RECURSO
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>ZU Media</td>
                          <td></td>
                          <td>Feb 2015 - Ene 2018<br /> CDMX, Col. San Angel Inn</td>
                          <td>
                            <ul>
                              <li>Coordinador de Animación y Postproducción</li>
                              <li>Producción de Spots para HBO, Natura México.</li>
                              <li>Animación de Infografías.</li>
                              <li>Edición de Spots para Tv Latinoamericana.</li>
                              <li>Edición de programa de Tv para Canal 11.</li>
                            </ul>
                          </td>
                          <td>
                            <button
                              onClick={() => openModal(formatYouTubeUrl("https://youtu.be/5veKZq1OXsk"))}
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              VER RECURSO
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>ED Escuela Digital</td>
                          <td></td>
                          <td>Oct 2012 - Ago 2014<br /> CDMX, Paseo de la Reforma</td>
                          <td>
                            <ul>
                              <li>Instructor de Cursos: “Postproducción de Video” y “Animación Digital”</li>
                              
                            </ul>
                          </td>
                          <td>
                          <button
                              onClick={() => openModal("/masterclass.webp")} // URL del recurso
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              VER RECURSO
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>Donceles 66, Foro Cultural</td>
                          <td></td>
                          <td>Jul 2012 - Ene 2013<br /> CDMX, Centro Histórico</td>
                          <td>
                            <ul>
                              <li>Webmaster</li>
                              <li>Realizador Audiovisual</li>
                            </ul>
                          </td>
                          <td>
                            <button
                              onClick={() => openModal("https://player.vimeo.com/video/57662024")} // URL del recurso
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              VER RECURSO
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>ClickOnero México</td>
                          <td></td>
                          <td>Feb - Nov 2011<br /> CDMX, Polanco</td>
                          <td>
                            <ul>
                              <li>Diseñador Gráfico</li>
                              <li>Motion Graphics</li>
                            </ul>
                          </td>
                          <td>
                            <button
                              onClick={() => openModal("https://player.vimeo.com/video/29595327")} // URL del recurso
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              VER RECURSO
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>El Salón de la Franquicia</td>
                          <td></td>
                          <td>Jun 2008 - Ene 2011<br />CDMX, Col. Del Valle</td>
                          <td>
                            <ul>
                              <li>Webmaster</li>
                              <li>Diseñador Gráfico para ads de revistas y espectaculares</li>
                              <li>Producción de cápsulas de franquicias expos</li>
                            </ul>
                          </td>
                          <td>
                            <button
                              onClick={() => openModal("https://www.youtube.com/embed/N4PNVg96VxE?si=d7bftOpXiIw4HMcC")} // URL del recurso
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              VER RECURSO
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>Secretaría de Seguridad Pública y Tránsito Municipal</td>
                          <td></td>
                          <td>Jun 2006 - Feb 2008<br />Puebla, Rancho Colorado</td>
                          <td>
                            <ul>
                              <li>Reportero Gráfico en el Departamento de Comunicación Social</li>
                              <li>Elaboración de nota informativa para medios locales</li>
                              <li>Fotografía policiaca y archivo fotográfico</li>
                            </ul>
                          </td>
                          <td>
                          <button
                              onClick={() => openModal("/notaroja.webp")} // URL del recurso
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              VER RECURSO
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>Sicom TV, Televisión del Estado de Puebla</td>
                          <td></td>
                          <td>Oct 2003 - Feb 2005<br />Puebla, Angelópolis</td>
                          <td>
                            <ul>
                              <li>Editor de video y Post-productor</li>
                            </ul>
                          </td>
                          <td>
                            <button
                              onClick={() => openModal("")} // URL del recurso
                              style={{
                                fontFamily: "'DIN Condensed', sans-serif",
                                textTransform: "uppercase",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#3b424c",
                                fontSize: "1.2rem",
                              }}
                            >
                              
                            </button>
                          </td>
                        </tr>
                        {/* Agrega más filas según sea necesario */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


{/* Sección para redes sociales */}
{index === 3 && (
      <div style={{ textAlign: "left", margin: "0 auto", maxWidth: "1200px" }}>
        <table
          style={{
            fontFamily: "'DIN Condensed', sans-serif",
            fontSize: "1.5rem",
            color: "#3b424c",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "10px 20px" }}>
                <a
                  href="https://www.behance.net/marcofrancisco"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#3b424c" }}
                >
                  BeHance
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px 20px" }}>
                <a
                  href="https://www.linkedin.com/in/marcofranciscoramos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#3b424c" }}
                >
                  LinkedIn

                  </a>
              </td>
            </tr>
            <tr>
            </tr>
            <tr>
            </tr>
            <tr>
            </tr>
            <tr>
            </tr>
            <tr>
            </tr>
            <tr>
            </tr>
          </tbody>
        </table>
      </div>


)}

            
          </div>
        );


        
      })}

<div style={{ position: 'relative' }}>
  <div style={{ 
    backgroundColor: '#e8e8e8', 
    color: '#3b424c', 
    fontSize: '13px', 
    textAlign: 'center', 
    padding: '5px 0', 
    position: 'absolute', 
    top: '-20px', 
    width: '100%' 
  }}>
    Sitio desarrollado con Next.js y asistencia de ChatGPT y DeepSeek
  </div>

  <footer style={{ backgroundColor: '#3b424c', padding: '50px 0', textAlign: 'center' }}>
    {/* Aquí puedes agregar cualquier contenido gráfico del banner */}
  </footer>
</div>

      

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#3b424c",
              }}
            >
              X
            </button>

            {resourceUrl.includes("vimeo") || resourceUrl.includes("youtube") ? (
              <div style={{ position: "relative", width: "80vw", height: "45vw", maxWidth: "960px", maxHeight: "540px" }}>
                <iframe
                  src={resourceUrl}
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : (
              <img src={resourceUrl} alt="Recurso" style={{ maxWidth: "100%", height: "auto" }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}