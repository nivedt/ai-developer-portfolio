const { execSync } = require('child_process'); 
const fs = require('fs'); 
const path = require('path'); 
 
try { 
  // Copy public folder to root temporarily 
  execSync('xcopy frontend\\public public\\ /E /I /Y', { stdio: 'inherit' }); 
ECHO is on.
  // Run build from frontend directory 
  process.chdir('frontend'); 
  execSync('npm run build', { stdio: 'inherit' }); 
ECHO is on.
  // Clean up 
  process.chdir('..'); 
  execSync('rmdir /s /q public', { stdio: 'inherit' }); 
} catch (error) { 
  console.error('Build failed:', error.message); 
  process.exit(1); 
} 
