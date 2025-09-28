const fs = require('fs').promises;
const path = require('path');

async function encodeJSONFiles() {
    const dataDir = './data/';
    const questionDir = './data/questions/';
    
    // Skip encoding categories.json for now
    const categoriesPath = path.join(dataDir, 'categories.json');
    if (await fileExists(categoriesPath)) {
        console.log('Skipping encoding of categories.json as requested.');
    } else {
        console.warn('categories.json not found');
    }

    // Encode all question files
    const questionFiles = await fs.readdir(questionDir).catch(() => []);
    for (const file of questionFiles) {
        if (file.endsWith('.json')) {
            const filePath = path.join(questionDir, file);
            try {
                let content = await fs.readFile(filePath, 'utf8');
                if (!content.trim()) {
                    console.warn(`Skipping empty file: ${file}`);
                    continue; // Skip empty files
                }
                content = JSON.parse(content);
                content.watermark = "© 2025 BrainyQuiz. Unauthorized use prohibited.";
                await fs.writeFile(filePath, JSON.stringify({
                    encoded: true,
                    data: Buffer.from(JSON.stringify(content)).toString('base64')
                }));
                console.log(`Encoded ${file}`);
            } catch (error) {
                console.error(`Error processing ${file}: ${error.message}`);
            }
        }
    }
    console.log('JSON encoding process completed.');
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

encodeJSONFiles().catch(error => console.error('Script failed:', error));