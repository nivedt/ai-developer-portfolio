const fs = require('fs'); 
const { execSync } = require('child_process'); 
 
console.log('Starting build process...'); 
 
// Copy frontend files to root for build 
execSync('xcopy frontend\\src src\\ /E /I /Y', { stdio: 'inherit' }); 
execSync('xcopy frontend\\public public\\ /E /I /Y', { stdio: 'inherit' }); 
execSync('copy frontend\\package.json package.json /Y', { stdio: 'inherit' }); 
execSync('copy frontend\\package-lock.json package-lock.json /Y', { stdio: 'inherit' }); 
 
// Run the build 
execSync('npm run build-react', { stdio: 'inherit' }); 
 
console.log('Build completed successfully!'); 
