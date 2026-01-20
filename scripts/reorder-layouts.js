/**
 * Script para reordenar layouts moviendo "Libre" al principio de cada intent
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/creation-flow-types.ts');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Intents que tienen layouts definidos
const intents = [
    'cita', 'equipo', 'logro', 'pasos', 'bts', 'oferta', 'pregunta', 'dato',
    'evento', 'lanzamiento', 'reto', 'servicio', 'escaparate', 'comunicado',
    'lista', 'comparativa', 'efemeride', 'talento', 'catalogo', 'definicion'
];

let changes = [];

for (const intent of intents) {
    // Buscar el inicio del array: "    intent: ["
    const arrayStartPattern = `    ${intent}: [`;
    let arrayStartLine = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(arrayStartPattern)) {
            arrayStartLine = i;
            break;
        }
    }

    if (arrayStartLine === -1) continue;

    // Buscar el layout Libre (tiene id: '{intent}-free')
    const libreIdPattern = `id: '${intent}-free'`;
    let libreStartLine = -1;
    let libreEndLine = -1;

    // Buscar desde el inicio del array
    for (let i = arrayStartLine + 1; i < lines.length; i++) {
        // Si encontramos el cierre del array, terminamos
        if (lines[i].trim() === '],') break;

        if (lines[i].includes(libreIdPattern)) {
            // Encontramos la línea con el id
            // Buscar hacia arriba el inicio del objeto ({)
            for (let j = i; j >= arrayStartLine; j--) {
                if (lines[j].trim().startsWith('{')) {
                    libreStartLine = j;
                    break;
                }
            }
            // Buscar hacia abajo el final del objeto (},)
            for (let j = i; j < lines.length; j++) {
                if (lines[j].trim() === '},') {
                    libreEndLine = j;
                    break;
                }
            }
            break;
        }
    }

    if (libreStartLine === -1 || libreEndLine === -1) {
        console.log(`No Libre layout found for: ${intent}`);
        continue;
    }

    // Extraer el bloque Libre
    const libreBlock = lines.slice(libreStartLine, libreEndLine + 1);

    // Verificar si ya está al principio (primera posición después del array start)
    if (libreStartLine === arrayStartLine + 1) {
        console.log(`${intent}: Libre already at first position`);
        continue;
    }

    changes.push({
        intent,
        arrayStartLine,
        libreStartLine,
        libreEndLine,
        libreBlock
    });

    console.log(`Found ${intent}: Libre at lines ${libreStartLine + 1}-${libreEndLine + 1}`);
}

// Aplicar cambios en orden inverso (para no afectar índices de líneas)
changes.sort((a, b) => b.libreStartLine - a.libreStartLine);

for (const change of changes) {
    // Remover el bloque Libre de su posición actual
    lines.splice(change.libreStartLine, change.libreEndLine - change.libreStartLine + 1);

    // Insertar el bloque Libre al principio del array
    lines.splice(change.arrayStartLine + 1, 0, ...change.libreBlock);
}

if (changes.length > 0) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`\nMoved ${changes.length} Libre layouts to first position.`);
} else {
    console.log('\nNo changes needed.');
}
