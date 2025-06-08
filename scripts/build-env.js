const fs = require('fs');
const path = require('path');
const { publicEnvVars } = require('../env.config.js');

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