---
name: "Que Estan Construyendo"
description: "Una publicacion independiente argentina construida con papel calido, tinta editorial y senales naranjas."
colors:
  paper: "#faf6ef"
  surface: "#ffffff"
  surface-soft: "#f4eee3"
  ink: "#1c1815"
  muted: "#6f675e"
  muted-visual: "#8c8378"
  line: "#e7dfd1"
  brand-tint: "#fbece0"
  brand: "#e5571f"
  brand-strong: "#d64a1e"
  brand-deep: "#b23c12"
  brand-hover: "#8f2e0d"
  argentina-blue-deep: "#215f88"
  argentina-blue: "#438fbd"
  argentina-gold: "#a36b00"
  info: "#1f5fa8"
  info-tint: "#e6eef7"
  success: "#2f7a4f"
  success-tint: "#e3f0e8"
  danger: "#c8392b"
  danger-tint: "#fae6e3"
  night: "#15120e"
  night-surface: "#1e1a15"
  night-ink: "#f3ede3"
  night-muted: "#948b7e"
  night-brand: "#f2693a"
  night-brand-hover: "#ff7d52"
  night-line: "#2d2822"
  ink-hover: "#352e28"
  editorial-copy-strong: "#514a43"
  editorial-copy: "#5f584f"
  editorial-copy-soft: "#625a52"
  editorial-copy-muted: "#6c645b"
  warm-copy: "#654d40"
  warm-copy-reject: "#5c463a"
  warm-copy-note: "#664c3e"
  night-copy: "#c9bfb2"
  warm-line: "#efd8c8"
  warm-line-strong: "#e8cbbb"
typography:
  display:
    fontFamily: "Newsreader Variable, Georgia, Times New Roman, serif"
    fontSize: "clamp(3.4rem, 7.8vw, 5rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "opsz 100"
  headline:
    fontFamily: "Newsreader Variable, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.9rem, 3.6vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "opsz 70"
  title:
    fontFamily: "Newsreader Variable, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.3rem, 2.3vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Hanken Grotesk Variable, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono Variable, Courier New, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  rule: "2px"
  tag: "4px"
  mark: "5px"
  email-action: "6px"
  control: "7px"
  notice: "8px"
  sheet: "10px"
spacing:
  hairline-gap: "5px"
  tight: "8px"
  control-gap: "10px"
  field-gap: "16px"
  paper-inset: "22px"
  email-inset: "34px"
  editorial-inset: "44px"
components:
  button-primary:
    backgroundColor: "{colors.brand-deep}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
    textColor: "{colors.surface}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
    height: "44px"
  button-ink-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.surface}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
    height: "44px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 13px"
    height: "46px"
  tag-default:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
  tag-demo:
    backgroundColor: "{colors.brand-tint}"
    textColor: "{colors.brand-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 7px"
  issue-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  email-action:
    backgroundColor: "{colors.night-brand}"
    textColor: "{colors.night}"
    rounded: "{rounded.email-action}"
    padding: "13px 18px"
  email-action-hover:
    backgroundColor: "{colors.night-brand-hover}"
    textColor: "{colors.night}"
---

# Design System: Que Estan Construyendo

## Overview

**Creative North Star: "Publicacion argentina en papel calido"**

QEC se lee como una publicación independiente argentina: papel cálido alrededor, superficies editoriales blancas, titulares de tinta en serif, acciones naranjas y metadatos monoespaciados. La voz visual es serena, selectiva y material; no debe parecer un dashboard de startup ni un funnel genérico de newsletter.

El sistema cubre web y email. En web, Newsreader aporta autoridad editorial, Hanken Grotesk mantiene legibles las acciones y JetBrains Mono identifica fecha, fuente, categoría y estado. El email conserva esa relación mediante Georgia, Arial y Courier New, sin depender de webfonts. La geometría se construye con reglas finas, campos claros y contenedores de papel.

La expresión implementada en la landing sigue el contrato actual: una cabecera silenciosa; una gran declaración Newsreader; el tagline de cadencia inmediatamente después del titular; descripción editorial; formulario de suscripción funcional; criterio de selección; edición demostrativa; envío de novedades. Esa secuencia pertenece a esa superficie y no establece un orden de conversión obligatorio para archivo, privacidad, ediciones ni futuros productos.

**Key Characteristics:**

- Papel ambiental cálido y hojas editoriales blancas.
- Tinta serif para lectura; sans para interfaz; mono para evidencia.
- Naranja de marca reservado para acciones, estados editoriales y énfasis explícito.
- Construcción plana mediante bordes de un píxel, cambios tonales y filas numeradas.
- Traducción de email robusta, monocolumna y basada en fallbacks de sistema.

## Colors

La paleta combina neutrales cálidos de publicación con un único acento naranja, azul informativo y colores de estado explícitos.

### Primary

- **Naranja editorial:** `brand-deep` es el fondo accesible de la acción principal, la sigla QEC y el tag patrocinado, siempre con blanco; `brand-hover` es el hover de esas acciones. `brand` conserva énfasis y firma, `brand-strong` es un paso intermedio para categorías, y `brand-tint` identifica demostración, feedback y patrocinio sin convertir toda la página en marca.
- **Naranja nocturno:** `night-brand` lleva acciones sobre fondos oscuros con texto `night`; `night-brand-hover` mantiene ese texto oscuro durante la respuesta de puntero.

### Secondary

- **Azul informativo:** `info` y `info-tint` están reservados para mensajes informativos, no para competir con la marca.
- **Estados:** `success`/`success-tint` y `danger`/`danger-tint` comunican resultados de formulario con texto explícito. El color nunca reemplaza el mensaje.

### Neutral

- **Papel y hojas:** `paper` es el entorno global; `surface` es la hoja blanca; `surface-soft` separa secciones editoriales secundarias.
- **Tinta y estructura:** `ink` lleva texto y foco; `muted` es el secundario legible para metadatos, placeholders, consentimiento y estados; `muted-visual` queda restringido a bordes y decoración; `line` divide hojas, filas y navegación; `ink-hover` oscurece la acción de tinta.
- **Escala de lectura:** `editorial-copy-strong`, `editorial-copy`, `editorial-copy-soft` y `editorial-copy-muted` ajustan contraste para leads, cuerpos y archivo sin introducir tonos fríos.
- **Campos cálidos de disclosure:** `warm-copy`, `warm-copy-reject`, `warm-copy-note`, `warm-line` y `warm-line-strong` pertenecen a paneles tintados de patrocinio, rechazo, demostración y feedback.
- **Modo nocturno:** `night`, `night-surface`, `night-ink`, `night-muted`, `night-copy` y `night-line` forman la mesa editorial oscura y el cierre del email.

### Named Rules

**The Paper Before White Rule.** `paper` es el mundo; `surface` es una hoja editorial contenida. No convertir todo en blanco indiferenciado.

**The Orange Has a Job Rule.** El naranja señala marca, acción o un estado editorial nombrado. No se usa como decoración distribuida al azar.

**The Argentina Exception.** La palabra `Argentina` en la declaración principal usa un degradado legible de azul celeste profundo y dorado solar. Es una firma tipográfica puntual, no una nueva paleta distribuida.

**The Explicit State Rule.** Información, éxito, error, demostración y patrocinio se entienden por texto antes que por color.

## Typography

**Display Font:** Newsreader Variable, con Georgia y Times New Roman como fallback.  
**Body/Interface Font:** Hanken Grotesk Variable, con Segoe UI y sans-serif como fallback.  
**Label/Mono Font:** JetBrains Mono Variable, con Courier New y monospace como fallback.  
**Email Fonts:** Georgia/Times New Roman/serif para editorial; Arial/Helvetica/sans-serif para interfaz; Courier New/monospace para metadatos.

**Character:** Newsreader hace que las afirmaciones parezcan editadas y publicadas, no promocionales. Hanken Grotesk es discreta y operativa; JetBrains Mono funciona como sello de fecha, fuente, categoría y trazabilidad.

### Hierarchy

- **Web display:** peso 500, óptico 100, tracking negativo y línea 0.98. La landing usa `clamp(3.4rem, 7.8vw, 5rem)` y `clamp(3rem, 15vw, 4.1rem)` en móvil; archivo usa `clamp(3.5rem, 8vw, 5rem)` y privacidad `clamp(3.2rem, 7vw, 4.8rem)`.
- **Web headline:** peso 500. Encabezados de sección usan `clamp(1.9rem, 3.6vw, 2.75rem)`; paneles, previews y feedback usan `clamp(2rem, 4vw, 3rem)`.
- **Web title:** títulos de señales usan `clamp(1.3rem, 2.3vw, 1.75rem)`; filas de archivo llegan a `clamp(1.3rem, 2.6vw, 1.85rem)` y el resumen compacto usa `1.4rem`.
- **Web editorial body:** Newsreader usa intencionalmente `1rem`, `1.02rem`, `1.05rem`, `1.08rem`, `clamp(1.1rem, 1.8vw, 1.3rem)` y `1.125rem`, con líneas entre 1.55 y 1.65 y medidas de 48-72ch.
- **Web interface body:** Hanken Grotesk parte de `0.9375rem`; botones usan `0.875rem`; navegación y enlaces `0.8125rem`; estados y consentimientos `0.75rem`; valores compactos también usan `0.78rem` y `0.8rem`.
- **Web metadata:** los tamaños pequeños son intencionales, siempre con mono, peso suficiente, mayúsculas y tracking abierto: `0.58rem`, `0.6rem`, `0.62rem`, `0.625rem`, `0.65rem` y `0.6875rem`. No son cuerpo de lectura.
- **Email display:** Georgia a `50px/50px`, reducida a `44px/40px` bajo 600px. El título nocturno usa `34px/38px`; títulos de historia y sponsor usan `25px` con líneas de `29-30px`.
- **Email body:** el lead usa `18px/29px`; historias y participación `15px/24px`; sponsor `14px/22px`; pie y enlaces `12px` con líneas de `18px` cuando corresponde.
- **Email metadata:** Courier New usa `9px` para meta, categorías, disclosure y nota legal, y `10px` para la marca QEC. El wordmark de interfaz usa Arial a `14px`; el botón usa Arial a `12px`.

### Named Rules

**The Serif Carries the Editorial Voice Rule.** Promesas, títulos, introducciones y resúmenes se componen en Newsreader o Georgia; controles y navegación no imitan esa voz.

**The Small Type Is Metadata Rule.** Los tamaños web de `0.58-0.6875rem` y email de `9-10px` son decisiones deliberadas solo para etiquetas breves, en mayúsculas, con tracking y contraste adecuados. Nunca se usan para párrafos, consentimiento largo ni información esencial sin contexto.

**The Email Hierarchy Survives Rule.** El email preserva contraste de escala y función tipográfica con fallbacks seguros; no depende de que carguen Newsreader, Hanken Grotesk o JetBrains Mono.

## Layout

La web usa un shell centrado de `min(1060px, calc(100vw - 48px))`. A 760px o menos pasa a 32px de margen total. Los bloques editoriales combinan columnas desiguales y espacios generosos; los cuerpos mantienen 48-72ch y las hojas de edición separan índice, metadatos y contenido mediante reglas.

Los colapsos observados responden al contenido: navegación a 520px, formularios y secciones compactas a 620px, hoja de edición a 680px, archivo a 700px, feedback a 720px, shell y privacidad a 760px, y composiciones amplias a 860px. En móvil se ocultan metadatos secundarios antes de comprimir texto esencial.

El email es una hoja blanca de 600px sobre papel cálido, con 34px de inset lateral y 22px bajo 600px. Es monocolumna, separa historias con reglas y no traslada grids web frágiles al cliente de correo.

**The Medium Owns the Composition Rule.** Web y email comparten material, jerarquía y semántica, no una grilla idéntica.

**The Surface Owns the Story Rule.** La promesa, suscripción, filtro, demo y envío describen la landing actual; otras rutas pueden ordenar sus tareas según su propia lectura.

## Elevation & Depth

El sistema es plano y no usa sombras. La profundidad surge del paso entre `paper`, `surface`, `surface-soft`, campos cálidos y superficies nocturnas, más bordes de un píxel. El foco visible es un outline de tinta de 2px con offset de 3px, una señal accesible y no una elevación.

El movimiento principal es una única entrada editorial en la primera carga: el titular se revela como tinta asentándose sobre papel y el texto y formulario continúan con un stagger breve. Usa `clip-path`, opacidad y transform con `cubic-bezier(0.23, 1, 0.32, 1)`; la variante de movimiento reducido conserva solo un fundido corto. Los botones responden al puntero con una compresión de `0.98` durante 140ms y una liberación de 100ms, además de sus cambios de color.

**The Flat Paper Rule.** Si una región necesita separación, usar tono, borde o estructura editorial; no sombra, vidrio ni gradiente.

## Shapes

Las formas son rectangulares y apenas suavizadas. La escala implementada es 4px para tags, 5px para la sigla, 7px para botones y campos, 8px para avisos, y 10px para hojas y paneles. El botón de email usa una excepción compatible de 6px. Los puntos de criterio son círculos funcionales, no una familia de pills.

**The Small Radius Rule.** La suavidad nunca debe volver al sistema blando o app-like. Contenedores grandes se detienen en 10px y controles en 7px.

## Components

### Buttons

- **Shape:** control compacto de 44px mínimos, radio de 7px y padding de 11px por 20px.
- **Primary:** `brand-deep` con texto blanco; hover en `brand-hover` durante 150ms. La misma combinación de alto contraste se usa en la sigla QEC.
- **Ink:** tinta con texto blanco; hover en `ink-hover`.
- **Ghost:** hoja blanca, borde de línea y tinta; en hover conserva blanco y refuerza el borde.
- **Disabled / Focus:** disabled usa `muted` y cursor de espera; foco usa el outline global visible. La acción nocturna usa `night-brand` y `night-brand-hover`, ambos con texto `night`.

### Tags

- **Default:** `surface-soft`, mono mayúscula, radio de 4px y padding de 3px por 7px.
- **Demonstration:** `brand-tint` con `brand-deep`.
- **Sponsored:** `brand-deep` con texto blanco y palabra explícita; el color no basta.

### Cards / Containers

- **Issue sheet:** hoja blanca, borde de línea, radio de 10px y overflow recortado. Cabecera, filas numeradas y footer se separan con reglas.
- **Disclosure panels:** feedback, rechazo y sponsor usan `brand-tint`, líneas cálidas, radios de 8-10px y copy cálido específico.
- **Shadow Strategy:** ninguna sombra; el material y el borde hacen el trabajo.

### Inputs / Fields

- **Style:** hoja blanca, línea `muted-visual` de un píxel, radio de 7px, 46px mínimos y padding de 10px por 13px.
- **Focus:** borde naranja más el outline global; placeholders en `muted`, siempre opacos.
- **Dark form:** `night-surface`, `night-line`, `night-ink` y `night-muted`, con acción `night-brand`/`night-brand-hover` y texto `night`.
- **Status / Consent:** espacio estable para mensaje, estado verbal y checkbox nativo de 16px con accent naranja.

### Navigation

La cabecera es silenciosa, de 64px (58px en compacto), sobre papel y con una regla inferior. La marca combina la sigla QEC en `brand-deep` con texto blanco y el nombre completo; enlaces Hanken discretos pasan a naranja en hover. En móvil se preserva la marca y la acción relevante, se reduce la navegación y finalmente se oculta antes de envolverla.

### Issue Sheet / Signal Record

La hoja de edición combina estado explícito, título Newsreader, metadatos mono, índices tabulares naranjas, categorías, resúmenes y disclosure de patrocinio. En móvil el índice baja de 72px a 44px y la cabecera apila sus columnas. La edición cero siempre permanece rotulada como demostración.

### Email Frame

El email coloca una hoja blanca de 600px sobre papel, abre con cabecera cálida, ordena historias con reglas, usa participación nocturna y cierra sobre `night-surface`. Reply-To, baja y demostración son visibles. Los radios, tamaños y fallbacks documentados son deliberados para clientes de correo.

## Do's and Don'ts

### Do:

- **Do** usar papel cálido, hojas blancas, tinta serif, naranja editorial y metadatos mono como sistema coherente.
- **Do** preservar etiquetas pequeñas solo en funciones breves de evidencia y estado; mantener el cuerpo de lectura en tamaños editoriales.
- **Do** construir jerarquía con ritmo, reglas, filas numeradas, medidas de lectura y cambios tonales.
- **Do** traducir la identidad al email con Georgia, Arial y Courier New, una columna y estilos compatibles.
- **Do** mantener demostración, patrocinio, consentimiento, éxito y error explícitos en palabras.
- **Do** separar `muted` para texto secundario de `muted-visual` para bordes y decoración.

### Don't:

- **Don't** hacer que QEC parezca un dashboard de startup, un SaaS genérico o un funnel intercambiable de newsletter.
- **Don't** recuperar la antigua Bitácora de señales, su papel frío, cobalt/lime, Archivo condensada, esquinas cortadas o grilla de registro.
- **Don't** usar sombras, glassmorphism, gradientes decorativos fuera de la firma `Argentina`, blobs, pills o radios mayores a los observados.
- **Don't** convertir el naranja en relleno decorativo o el azul informativo en una segunda marca.
- **Don't** copiar el orden de conversión de la landing en archivo, privacidad, edición o email.
- **Don't** depender de webfonts, hover, movimiento o layouts multicolumna para comunicar significado en email.
