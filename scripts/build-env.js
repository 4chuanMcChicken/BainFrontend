import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { publicEnvVars } from '../env.config.js';

// ES modules中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建环境变量内容
const envContent = publicEnvVars
    .map(key => {
        const value = process.env[key];
        if (!value) {
            console.warn(`Warning: ${key} is not set`);
            return `${key}=''`;
        }
        return `${key}=${value}`;
    })
    .join('\n');

// 写入.env文件
fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);

console.log('Environment variables have been set up successfully.'); 