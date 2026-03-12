# Checklist operativo: responsive + i18n

Estado: en curso  
Prioridad actual: responsive/mobile primero, i18n despues

## 0. Bloqueos y contexto

- [x] Revisar `docs/TECHNICAL_REFERENCE.md`
- [x] Consultar skill `responsive-design`
- [x] Consultar skill `i18n-localization`
- [ ] Confirmar o restaurar `DONT_TOUCH.md` en raiz
- [ ] Identificar componentes estables que no deben tocarse sin confirmacion

## 1. Auditoria responsive base

- [x] Revisar `src/app/layout.tsx` y `src/app/globals.css`
- [x] Revisar shells de navegacion en `src/components/layout`
- [x] Revisar `DashboardLayout`, `Header`, `Sidebar`, `MobileMenu`, `MobileNav`
- [ ] Detectar anchos fijos, alturas rigidas y overflows horizontales
- [ ] Detectar tablas, previews y paneles con riesgo en mobile
- [ ] Detectar modales y dialogos que no escalen bien en pantallas pequenas
- [ ] Detectar formularios y CTAs con tap targets pobres

## 2. Correcciones responsive estructurales

- [x] Ajustar contenedores principales a enfoque mobile-first
- [x] Corregir navegacion desktop/mobile sin duplicar logica innecesaria
- [x] Garantizar `min-w-0`, truncado y wraps donde proceda
- [ ] Eliminar dependencias de anchos fijos evitables
- [ ] Corregir scrolls internos conflictivos
- [ ] Revisar espaciado vertical para mobile y tablet

## 3. Responsive en modulos criticos

- [ ] `src/app/studio`
- [ ] `src/app/image`
- [ ] `src/app/carousel`
- [ ] `src/app/video`
- [ ] `src/app/brand-kit`
- [ ] `src/app/settings`
- [ ] `src/app/onboarding`
- [ ] `src/app/admin`

## 4. Infraestructura i18n

- [x] Verificar si ya existe provider i18n
- [x] Revisar configuracion real en `src/lib/i18n`
- [ ] Confirmar estrategia de locale por defecto y persistencia
- [ ] Confirmar namespaces por dominio (`common`, `studio`, `auth`, `admin`, etc.)
- [x] Verificar integracion del provider en layout global o shells correctos
- [ ] Definir fallback consistente ES/EN

## 5. Extraccion de textos

- [ ] Navegacion y layout global
- [ ] Landing/home
- [ ] Auth (`sign-in`, `sign-up`, `sso-callback`)
- [ ] Onboarding
- [ ] Settings
- [ ] Brand Kit
- [ ] Studio / Image / Carousel / Video
- [ ] Admin
- [ ] Toasters, errores, estados vacios y placeholders

## 6. Calidad de localizacion

- [ ] Evitar concatenaciones de strings traducidas
- [ ] Revisar pluralizacion y mensajes dinamicos
- [ ] Revisar formatos de fechas y numeros con `Intl`
- [ ] Validar longitud de textos en EN sobre layouts mobile
- [ ] Preparar base para futuros textos RTL sin acoplar estilos a izquierda/derecha

## 7. Verificacion tecnica

- [x] Buscar strings hardcodeados prioritarios
- [x] Ejecutar revision anti-mojibake en `src`
- [x] Ejecutar lint/test cuando haya cambios funcionales
- [ ] Pedir verificacion manual a Juanfran tras cada bloque de cambios

## 8. Orden de ejecucion recomendado

1. Layout global y navegacion
2. Studio / Image / Carousel
3. Brand Kit / Settings / Onboarding
4. Admin
5. Infraestructura i18n
6. Extraccion de textos por modulos
7. Ajuste final responsive en ES y EN
