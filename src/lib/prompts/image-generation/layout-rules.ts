export const buildLayoutInstruction = (description: string) => `
COMPOSICIÓN Y PLANIMETRÍA (DIRECCIÓN TÉCNICA OBLIGATORIA):
Usa la imagen etiquetada como [REF_PLANTILLA_ESTRUCTURAL] como un MAPA ESTRUCTURAL SAGRADO. 
- CALCA la distribución espacial y la jerarquía de los elementos.
- DESCRIPCIÓN REFORZADA: ${description}
- Respeta la ALINEACIÓN MILIMÉTRICA de los bloques de texto y contenedores.
- Ignora el contenido visual de la plantilla (colores/fotos de ejemplo); solo hereda su GEOMETRÍA DE COMPOSICIÓN.
- La fidelidad al layout de [REF_PLANTILLA_ESTRUCTURAL] es prioritaria sobre cualquier inferencia estética propia.
`
