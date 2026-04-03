# Professional Logs — Marco Francisco

Registro de dirección, decisiones estratégicas, ideas, áreas de oportunidad y crecimiento técnico-creativo.
Se alimenta al cierre de cada sesión. No incluye detalles de implementación — solo lo que importa a nivel de dirección y evolución.

---

## 2026-01-21 | Session 002

### Dirección creativa
- Se definió la identidad visual del portfolio como un "HUD de misión" — sci-fi, terminal, monoespaciado. No es un portfolio convencional de cards bonitas: es un centro de control que comunica que Marco **construye** cosas, no solo las diseña.
- El Lab Terminal es un statement de posicionamiento: "yo soy quien opera esto, no quien lo consume."

### Decisión arquitectónica
- Data model unificado desde el inicio: una sola tabla `project_media` alimenta tanto el Lab Terminal (vista técnica) como la sección pública (vista portfolio). Un upload en admin → aparece en ambos lados. Esto evitó duplicar lógica de media desde el día uno.

### Área de oportunidad
- No se estableció un pipeline de testing desde el inicio. Todo se valida visualmente. A medida que el proyecto crece, esto se vuelve un riesgo real.

---

## 2026-01-22 | Sessions 004, 006

### Decisión de infraestructura
- Full commitment a Cloudflare stack: Pages, Workers, D1, R2. Cero dependencia de AWS/Vercel/Supabase. Ventaja: un solo proveedor, billing unificado, edge-first. Riesgo: vendor lock-in y limitaciones de D1 (SQLite, sin JOINs complejos, sin triggers avanzados).
- R2 para media con URL pública directa — sin proxy intermedio. Simple, rápido, pero requiere CORS manual.

### Insight técnico
- La decisión de componentes expandibles (ActivityPulse, MediaPreview, LogDetailsPanel) mostró que la UI del portfolio puede ser modular sin over-engineering. Cada componente tiene un estado colapsado (inline) y expandido (modal). Patrón reusable.

### Área de oportunidad
- El local dev environment depende de in-memory stores que se resetean. No hay un workflow confiable de desarrollo local con datos persistentes. Esto ralentiza el testing de features que dependen de estado.

---

## 2026-01-23 | Sessions 007, 008

### Pivote de identidad
- De "Motion Designer" a "Motion Developer Artist" / "Creative Technologist". No es cosmético — cambia qué proyectos se muestran, cómo se describen, y qué tipo de cliente/oportunidad se atrae. El portfolio ahora dice "hago código + motion + AI", no "hago videos bonitos".

### Decisión de producto
- Admin Console como primera prioridad sobre features públicas. Lógica: sin admin funcional, no hay contenido, y sin contenido el portfolio está vacío. Invertir en tooling interno primero fue la decisión correcta.

### Categorías: primera oscilación
- Se crearon 49 categorías granulares organizadas en 9 grupos. Intención: cubrir todo lo que Marco hace. Problema potencial: demasiada granularidad para un portfolio de 3 proyectos. La relación categorías/proyectos estaba desbalanceada.

### Área de oportunidad
- Credenciales hardcodeadas en migration file y session docs. No hay manejo de secrets. Para un proyecto personal está bien, pero es un hábito que no escala.

---

## 2026-02-11 — 2026-02-12 | Pre-session fixes

### Decisión técnica
- Se descubrió que GitHub auto-deploy a Cloudflare Pages está roto silenciosamente. Decisión pragmática: no invertir tiempo en debuggearlo ahora, usar `npm run deploy` manual. Trade-off consciente: velocidad de shipping vs CI/CD automatizado.

### Patrón de debugging
- Bugs que "no deberían existir" a menudo son deploys que no llegaron a producción. Regla aprendida: **siempre verificar que el deploy realmente se ejecutó** antes de debuggear código.

### Área de oportunidad
- No hay monitoreo de errores en producción. Los bugs se descubren manualmente navegando el sitio. Un Sentry o similar daría visibilidad sin esfuerzo.

---

## 2026-02-20 — 2026-02-22 | Pre-session 001

### Decisión arquitectónica
- Reemplazo completo del Lab Terminal por Sphere HUD (Three.js/R3F). No fue un upgrade incremental — fue un rewrite total. Justificación: el Lab Terminal ya había servido su propósito de prototipo, y el Sphere HUD comunica mejor la identidad "creative technologist" con una visualización 3D interactiva.

### Riesgo asumido
- Three.js en portfolio personal = apuesta fuerte. Requiere GPU, no funciona en SSR, puede fallar en dispositivos bajos. Se mitigó con `dynamic import + ssr: false`, pero no hay fallback para dispositivos sin WebGL. Es una decisión de posicionamiento: "si tu device no puede con esto, no eres mi audiencia".

### Área de oportunidad
- La configuración visual del Sphere (colores, bloom, partículas) se delegó a un admin panel con sliders. Buena idea para iteración rápida, pero nadie más que Marco lo va a tocar. ¿Realmente necesita un admin panel o bastaría con constantes en código?

---

## 2026-02-27 | Session 001

### Pivote terminológico
- Toda la terminología dev (Build/Ship/Experiment/Polish) reemplazada por terminología creativa (Interactive/Commercial/Tools/Experimental/StoryTelling/VideoGame). No es solo renombrar labels — es redefinir cómo se categoriza el trabajo. Un proyecto ya no es un "feature" sino una "pieza creativa".

### Professional Log como producto separado
- Se creó el sistema de Professional Logs independiente de project logs. Decisión clave: el professional log es **personal**, no está atado a un proyecto específico. Es un diario de dirección, no un changelog técnico. Esto permite registrar reflexiones, estrategia, y estado emocional (mood/energy) que no tienen lugar en un devlog.

### Decisión técnica: jspdf client-side
- PDF generation en el browser via dynamic import. Cero dependencia de servidor para generar PDFs. Trade-off: menos control de layout, pero zero-infra.

### Área de oportunidad
- El professional log no tenía vinculación con proyectos. Las reflexiones quedan huérfanas sin contexto. Esto se corrigió en session 005 (project_id column).

---

## 2026-03-04 | Session 002

### Categorías: segunda oscilación
- De 6 categorías simplificadas de vuelta a 49 granulares. La simplificación de session 001 fue prematura — con solo 3 proyectos, 6 categorías parecían suficientes, pero al pensar en el crecimiento del portfolio, 49 permite clasificación precisa. Lección: **no simplificar lo que aún no has llenado**.

### Componente ProjectCard como evolución natural
- El auto-slideshow en cards fue una mejora de alto impacto con esfuerzo moderado. Convierte un portfolio estático en algo que se siente vivo. La configurabilidad del intervalo desde admin fue un over-engineering innecesario — un default fijo de 4s hubiera sido suficiente.

### Área de oportunidad
- Testing mobile se ha diferido en cada sesión. Ya van 4+ sesiones con "test mobile responsiveness" en pendientes. Es deuda técnica acumulándose. Necesita una sesión dedicada o un emulador en el workflow.

---

## 2026-03-05 | Sessions 003, 004

### Sistema de códigos de proyecto
- Los códigos random (`PRJ-S9X`) no comunicaban nada. Los nuevos (`SAA-NAV`, `APA-RTA`) son legibles y dan contexto inmediato. Lección: los identificadores internos importan — si tú mismo no puedes leer un código y saber qué proyecto es, el sistema falla.

### Bug de media delete: lección sobre integridad
- El admin "eliminaba" media visualmente pero nunca borraba de R2. Archivos huérfanos acumulándose en storage. Lección: **siempre verificar que las operaciones destructivas realmente llegan al backend**. El UI optimista sin confirmación de API es peligroso para operaciones de borrado.

### Área de oportunidad
- No hay auditoría de storage. No se sabe cuántos archivos hay en R2, cuántos son huérfanos, cuánto espacio se usa. Un script de reconciliación D1↔R2 sería valioso.

---

## 2026-03-05 | Session 005 (actual)

### Sphere HUD Upgrade: planificación por fases
- Se ejecutaron 4 fases en una sola sesión, planificadas desde la sesión anterior. El plan detallado (archivos, queries, cambios exactos) permitió ejecución rápida sin decisiones ad-hoc. Lección: **planificar la sesión siguiente al cerrar la actual** reduce friction dramáticamente.

### Show in Sphere como control editorial
- El toggle `show_in_sphere` es un control editorial, no técnico. Permite tener proyectos en el portfolio que no aparecen en la visualización 3D. Separa "existe" de "se muestra". Esto es pensamiento de producto, no de developer.

### Professional Logs vinculados a proyectos
- La corrección del diseño original: ahora los professional logs pueden asociarse a un proyecto. Esto cierra el gap entre reflexión personal y contexto de proyecto. Un log que dice "me frustré con el performance" ahora tiene el proyecto asociado.

### Modal redesign: UX sobre tecnología
- El rewrite del ProjectDetailPanel no fue por capricho visual — el anterior crasheaba con un error de useMemo. Pero en vez de solo parchear el bug, se aprovechó para repensar la experiencia: modal con blur, layout responsive, neon orange coherente con la marca. Cuando un fix requiere rewrite, **es una oportunidad de upgrade, no solo de reparación**.

### Áreas de oportunidad acumuladas
1. **Testing mobile** — diferido 5+ sesiones. Deuda crítica.
2. **GitHub auto-deploy** — workaround manual funciona pero no escala.
3. **Zero monitoring** — no hay Sentry, no hay logs de producción, no hay alertas.
4. **WebGL fallback** — dispositivos sin GPU ven nada. Necesita al menos un fallback estático.
5. **Reconciliación R2** — archivos huérfanos potenciales sin auditoría.
6. **Content strategy** — hay 3 proyectos. El portfolio necesita contenido. La infraestructura está lista, falta llenarla.

---

## 2026-03-05 | Session 006

### Lección de proceso: bugs fundamentales disfrazados
- El crash del hexagon click se persiguió como "Objects not valid as React child" (error #310 minificado). Se investigó data, API responses, rendering — nada. La causa real: hooks en orden incorrecto. Un bug de ESTRUCTURA, no de datos. Lección: **cuando el error minificado no tiene sentido, buscar violaciones de reglas fundamentales del framework antes de investigar datos**.

### Decisión UX: el modal como experiencia, no como popup
- El modal pasó de 860px fijo a 92vw x 88vh con animaciones de entrada/salida. No fue feature creep — el modal anterior era funcionalmente correcto pero se sentía como un popup genérico. En un portfolio que pretende comunicar "creative technologist", cada interacción es una oportunidad de demostrar craft. Las animaciones no son decoración: son parte del producto.

### Pattern aprendido: exit animations en React sin librería
- CSS keyframes + estado `closing` + setTimeout = animaciones de salida sin Framer Motion. El truco: no unmount el componente inmediatamente, sino marcar `closing=true`, dejar que CSS anime, y DESPUÉS llamar `onClose`. Pattern simple, cero dependencias.

### Area de oportunidad
- El proceso de deploy sigue siendo fragil. El token de Wrangler expiró mid-session. No hay CI/CD, no hay health checks post-deploy, no hay rollback automatizado. Cada deploy es manual y requiere autenticación interactiva. Esto es aceptable para un solo developer, pero es exactamente el tipo de cosa que explota cuando más se necesita (demo, presentación, deadline).

---

## 2026-03-05 | Session 007

### Decision de producto: CV como sistema, no como pagina
- El CV deja de ser una pagina estatica con datos hardcoded en `translations.js`. Pasa a ser un sistema completo: base de datos, admin CRUD, seccion publica dinamica, y documento descargable. Esto es un cambio de paradigma: el portfolio ya no "muestra" un CV, lo **genera y mantiene**.
- La separacion visual (web rica) vs descargable (PDF austero ATS-friendly) es una decision consciente. El reclutador humano ve la web, el ATS parsea el PDF. Diferentes audiencias, diferentes formatos, misma fuente de datos.

### Insight de mercado: ATS compliance
- Los sistemas ATS (Workday, Greenhouse, Lever) rechazan silenciosamente CVs con formato complejo. El CV actual de Marco (2 columnas, iconos, QR) es visualmente profesional pero probablemente no pasa un ATS. El nuevo PDF single-column con headers estandar y texto plano esta disenado para ser parseable por maquinas sin perder profesionalismo para humanos.

### Professional Log como diferenciador
- Integrar los ultimos professional logs como "Recent Activity" en la seccion CV publica es un diferenciador real. Ningun CV estatico muestra que estas activamente construyendo. Un HR que ve "3 dias atras: implementando sistema 3D con Three.js" entiende que este candidato esta activo, no estancado.

### Area de oportunidad
- Bilingual CV (EN/ES) requiere mantener doble contenido para cada entry. El admin necesita un workflow claro para esto — toggle de idioma o tabs. Si no es intuitivo, se actualizara un idioma y se olvidara el otro. Hay que disenar el UX del admin pensando en que Marco mantiene ambos idiomas.

---

## 2026-03-28 | Session 010

### Direccion de producto
- La decision de mostrar las 49 categorias aunque no tengan proyectos es una decision de posicionamiento, no tecnica. El portfolio dice "hago todo esto" antes de tener evidencia de todo. Es una apuesta: si alguien llega buscando "Data Visualization" y no hay proyectos, es decepcionante. Pero si no aparece la categoria, nunca saben que Marco lo hace. Mejor over-promise y llenar despues que under-represent.

### Insight UX: hover como preview
- El tooltip en los hexagonos transforma la esfera de "cosa bonita que gira" a "interfaz navegable". Antes, el unico feedback era un glow mas intenso — cero informacion. Ahora el hover comunica: que proyecto es, en que estado esta. Esto reduce la friccion para hacer click. Leccion: **el hover es el pitch mas corto que existe — usalo para dar contexto, no solo feedback visual**.

### Decision tecnica: normalizacion de URLs
- El bug de URL relativa es clasico pero revela un patron: el admin no valida ni normaliza inputs. El campo `externalUrl` acepta cualquier string. La normalizacion en 3 puntos (frontend + 2 APIs) es un parche correcto pero el patron real seria validacion en el admin form. No se hizo porque el scope era el fix, no el refactor del form.

### Areas de oportunidad
1. **Contenido** — la infraestructura esta lista (49 categorias, tooltips, filtros, modal con media). Pero solo hay 4 proyectos. El bottleneck ya no es tech, es contenido. Necesita una sesion dedicada exclusivamente a agregar proyectos desde admin.
2. **Touch hover** — en movil no hay hover. El tooltip solo funciona en desktop. Necesita una interaccion alternativa para movil (tap para tooltip, segundo tap para expandir, o long-press).
3. **Admin validation** — el admin acepta datos sin normalizar (URLs, texto, etc.). No es critico ahora pero se acumulara.

---

## 2026-03-05 | Session 008

### Ejecucion de plan: de spec a produccion
- La sesion anterior (007) fue planificacion pura. Esta sesion ejecuto las 5 fases del spec en una sola sentada. El spec detallado (tablas, endpoints, archivos, datos) elimino casi toda la ambiguedad. Leccion reforzada: **la planificacion previa no es overhead, es aceleracion**.

### CV como sistema vivo
- El CV ya no es un documento estatico. Es un sistema con CRUD admin, API publica, seccion web dinamica, y PDF descargable. Cualquier cambio en experiencia, skills, o datos personales se refleja en la web Y en el PDF simultaneamente. Esto es lo que diferencia a un developer de alguien que sube un PDF a LinkedIn.
- La inclusion de marcomotion.com como freelance activo con bullets sobre Three.js, Cloudflare Workers, y AI tools posiciona el CV como "en construccion activa", no como un archivo de pasado.

### Decision de resiliencia: fallback a hardcoded
- Si la API falla, la seccion de experiencia cae al data de `translations.js`. Esto parece defensivo, pero en produccion es critico: un error de D1, un token expirado de Cloudflare, o un deploy parcial no deberian dejar la seccion en blanco. El fallback es invisible para el usuario — solo ve contenido, sin saber si viene de API o de fallback.

### Bilingual UX resuelto
- El admin tiene toggle EN/ES que recarga datos del idioma seleccionado. La seccion publica re-fetcha automaticamente cuando el usuario cambia idioma. El problema planteado en session 007 (que se actualizaria un idioma y se olvidaria el otro) se resolvio con el Seed button que carga ambos idiomas de golpe.

### Areas de oportunidad
1. **Testing mobile del CV** — la seccion tiene CSS responsive pero no se ha verificado en dispositivos reales. El skills grid (2 columnas) y el timeline pueden necesitar ajustes en 375px.
2. **ATS validation** — el PDF se genera correctamente pero no se ha probado en simuladores de ATS reales. Herramientas como Jobscan o ResumeWorded podrian validar parseabilidad.
3. **Content gap** — la infraestructura esta completa para 50+ proyectos, pero solo hay 4. El portfolio necesita contenido. La proxima prioridad deberia ser agregar proyectos reales, no mas features.
4. **Deploy fragility** — el token de Wrangler volvio a expirar mid-session. Este es un patron recurrente que sugiere que el OAuth de Cloudflare tiene TTL corto. Considerar API tokens en lugar de OAuth para mayor estabilidad.

---

### Session 012 — 2026-04-02

#### Direction & Decision-Making
- Marco immediately identified that creative logs and professional logs needed differentiation in the modal — they were visually undifferentiated, creating confusion about what each section does. The decision to allocate 2/3 vs 1/3 space was instant and firm. This ratio communicates that creative logs are the primary content, professional logs are supporting context.
- The priority system request reveals a product-thinking pattern: Marco wants editorial control over what visitors see first. This is curation, not chronology. A portfolio that shows work in manually-curated order is fundamentally different from one that shows newest-first. Marco is thinking like a creative director, not a developer.
- Chose to link creative logs to existing project_media rather than allowing free URL input. This was a deliberate constraint: media should be managed in one place (the media tab), not scattered across logs with random URLs. Single source of truth over convenience.

#### Technical Strategy
- Plan-first approach: used formal plan mode before writing any code. The plan covered migration, API, admin UI, frontend, and hook changes across 8 files. This prevented the "fix one thing, break another" cascade that happened in earlier sessions with ad-hoc changes.
- The reorder API follows the exact pattern of `/api/admin/cv/reorder.js` — `db.batch()` for bulk updates. Consistent patterns across the codebase reduce cognitive load for future sessions.
- `sort_order ASC, created_at DESC` ordering means: manually prioritized items come first, unprioritized items (sort_order=0) fall back to date order. This is a progressive enhancement — existing data works unchanged, new priorities layer on top.
- The modal info section changed from `overflow-y: auto` to `overflow: hidden` with `min-height: 0`, letting child flex containers handle their own scrolling. This is the correct CSS flex pattern for nested scroll containers.

#### Creative
- The 2/3 + 1/3 split with a subtle vertical divider (1px orange at 12% opacity) maintains the HUD aesthetic while clearly separating content types. On mobile, it collapses to vertical stack with a horizontal divider — responsive without losing clarity.

#### Areas of Opportunity
1. **No commits made this session** — changes deployed but not committed to git. This is a recurring pattern (also noted in session 011). Work could be lost if the local directory is damaged.
2. **Creative logs currently have no media linked** — the infrastructure is ready but all existing dev_logs have `media_id = NULL`. Marco needs an admin session to assign media to logs for the click-to-view feature to be visible.
3. **Professional logs section might feel too cramped** at 1/3 width on smaller screens — worth checking at 1024px-1200px range where the modal is narrower.
4. **No delete capability for existing creative logs** — admin can reorder and link media, but can't delete a log entry. This wasn't requested but may be needed as the portfolio evolves.

---

### Session 011 — 2026-04-02

#### Direction & Decision-Making
- Marco iterated rapidly on the Activity Log panel — 5 visual/functional pivots in one session. Each pivot was clear and decisive: "this is wrong, fix X". No waffling. This rapid feedback loop is efficient but requires the developer to ship fast and not over-invest in any single iteration.
- Resolved a long-standing naming confusion between Creative Logs and Professional Logs. The confusion surfaced when a broken admin link forced the question "what is this?". Lesson: **if the creator confuses their own concepts, users will be lost**. Naming matters as much as architecture.
- Stripped the professional log admin form of 5 fields (category, mood, energy, media type, media URL) in one pass. Marco knows what he doesn't need — aggressive simplification of admin tooling to reduce friction for content entry.

#### Technical Strategy
- The Activity Log panel evolved from CSS auto-scroll ticker → static scrollable panel with controls. The auto-scroll approach was technically interesting but wrong for the use case: professional logs need to be readable and navigable, not a news ticker. Filter + sort + expand is the right interaction model for curated content.
- Professional logs repurposed `media_url` field as a link URL. No migration needed — the column already existed. Pragmatic reuse over schema changes.
- Dual-mode media viewer in ProjectDetailPanel (project media carousel vs log media) is clean state management: one `selectedLogId` state toggles the entire view.

#### Creative
- Activity Log panel designed to match LAB TERMINAL HUD aesthetic — mono font, scanlines, glow FX, accent colors from admin config. The visual language is consistent across sphere, modal, and activity panel.
- Project codes in the activity log use text-shadow glow — subtle but reinforces the HUD identity.

#### Areas of Opportunity
1. **Content is the bottleneck** — the infrastructure (Activity Log, filters, expand, links, glow) is ready but only has 3 professional log entries. Marco needs a dedicated session just for content entry.
2. **Admin form could auto-detect link in content** — instead of a separate Link URL field, detect URLs in the content textarea and auto-extract. Lower friction for entry.
3. **7 deploys in one session** — iterative deployment works but is inefficient. Consider local dev preview (`npm run dev`) for visual iteration instead of deploying each change to production.
4. **No commit for iterations** — only the initial commit was made. 6 subsequent deploys are uncommitted. Need a final commit to preserve all work in git.

---

## 2026-03-24 | Session 009

### Deuda tecnica pagada
- Mobile responsiveness estaba diferida 8 sesiones. Cada sesion se priorizaba features sobre UX basica. Hoy se pago esa deuda: 4 breakpoints consistentes (768/600/480/320) en todas las paginas publicas. La leccion: la deuda de UX es invisible hasta que un usuario real la encuentra — y para un portfolio, el primer usuario real es el reclutador que lo abre en su telefono.

### Estrategia de breakpoints
- Se eligieron 4 breakpoints en lugar de los 2 que habia (768/480). La razon: el salto de 768 a 480 era demasiado abrupto — en 600px (tablet portrait) el sitio se veia desordenado. El breakpoint 320px cubre el edge case de dispositivos pequenos que aun son comunes en mercados emergentes.

### Prioridad publica vs admin
- Se decidio conscientemente NO tocar admin en esta sesion. El admin lo usa solo Marco desde desktop. Las paginas publicas las ve cualquiera desde cualquier dispositivo. La priorizacion fue correcta: maximo impacto con minimo scope.

### Area de oportunidad
1. **Testing en dispositivos reales** — DevTools no es igual que un telefono fisico. Los tap targets se sienten diferentes con dedos reales. Hay que probar en iPhone y Android antes de declarar victoria.
2. **Performance 3D en mobile** — el SphereHUD ahora es responsive visualmente, pero no se ha verificado el rendimiento de Three.js/WebGL en telefonos de gama media. Podria necesitar reduccion de particulas o hexagonos en mobile.
3. **Admin mobile** — eventualmente Marco podria querer editar contenido desde el telefono. Las paginas admin solo tienen cobertura parcial a 768px.
