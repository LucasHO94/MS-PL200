import fs from 'fs';

const content = fs.readFileSync('./src/questions_en.js', 'utf8');
// Remove o export para tentar parsear como array
const arrayText = content.replace(/export const \w+ = /, '').trim();

// Tenta parsear linha por linha acumulada
let currentText = '';
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    try {
        // Isso não funciona bem para JS. 
        // Vou usar o motor de Script do Node
    } catch(e) {}
}

const script = `
try {
    ${content}
    console.log("OK");
} catch (e) {
    console.error(e);
}
`;

fs.writeFileSync('./scratch/validator.js', script);
