import fs from 'fs';
import path from 'path';

// Load environment variables manually since dotenv might not be available
// This must be imported BEFORE any other imports that rely on process.env
console.log('Using scripts/env-loader.ts');

const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`Loading env from ${file}`);
        const content = fs.readFileSync(filePath, 'utf8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                if (!process.env[key]) {
                    //   console.log(`   Setting ${key}`);
                    process.env[key] = value;
                }
            }
        });
    }
}
console.log('WISDOM_API_KEY status:', process.env.WISDOM_API_KEY ? 'SET' : 'MISSING');
