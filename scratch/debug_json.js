const fs = require('fs');
const content = fs.readFileSync('./src/questions_en.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    try {
        // Tenta parsear blocos de 100 linhas para localizar o erro
        const snippet = lines.slice(0, i + 1).join('\n') + '\n];';
        // Note: Isso é simplista mas pode ajudar a ver onde quebra
    } catch (e) {
        // ...
    }
}

// Melhor abordagem: Tentar dar require e pegar a linha do erro no stack trace
try {
    require('./src/questions_en.js');
} catch (e) {
    console.log(e.stack);
}
