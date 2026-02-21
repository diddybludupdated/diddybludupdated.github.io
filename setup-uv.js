const fs = require('fs');
const path = require('path');

const uvPath = path.dirname(require.resolve('@titaniumnetwork-dev/ultraviolet/package.json'));
const distPath = path.join(uvPath, 'dist');
const targetPath = __dirname;

if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
}

const filesToCopy = [
    'uv.bundle.js',
    'uv.handler.js',
    'uv.sw.js'
];

filesToCopy.forEach(file => {
    const src = path.join(distPath, file);
    const dest = path.join(targetPath, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file} to uv/`);
    } else {
        console.error(`Could not find ${file} in ${distPath}`);
    }
});

console.log('Ultraviolet setup complete!');
