const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Define the path to the frontend folder
    const frontendPath = path.join(__dirname, 'frontend');
    
    // Function to serve static files
    const serveStaticFile = (filePath, contentType) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Error reading file:', err.message);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    };

    // Route handling
    if (req.url === '/' || req.url === '/index.html') {
        serveStaticFile(path.join(frontendPath, 'index.html'), 'text/html');
    } else if (req.url === '/about.html') {
        serveStaticFile(path.join(frontendPath, 'about.html'), 'text/html');
    } else if (req.url === '/contact.html') {
        serveStaticFile(path.join(frontendPath, 'contact.html'), 'text/html');
    } else if (req.url === '/portfolio.html') {
        serveStaticFile(path.join(frontendPath, 'portfolio.html'), 'text/html');
    } else if (req.url === '/login.html') {
        serveStaticFile(path.join(frontendPath, 'login.html'), 'text/html');
    } else if (req.url === '/styles.css') {
        serveStaticFile(path.join(frontendPath, 'styles.css'), 'text/css');
    } else if (req.url === '/script.js') {
        serveStaticFile(path.join(frontendPath, 'script.js'), 'text/javascript');
    } else if (req.url.startsWith('/assets/')) {
        // Serve image files
        const imagePath = path.join(frontendPath, req.url);
        const contentType = req.url.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
        serveStaticFile(imagePath, contentType);
    } else if (req.url === '/api/login' && req.method === 'POST') {
        // Handle login POST request
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            // In a real application, you would validate against a database
            if (username === 'admin' && password === 'password') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

