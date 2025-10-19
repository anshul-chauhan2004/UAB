const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Define the path to the public directory
    const publicPath = path.join(__dirname, 'public');
    
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
        serveStaticFile(path.join(publicPath, 'index.html'), 'text/html');
    } else if (req.url === '/about.html') {
        serveStaticFile(path.join(publicPath, 'about.html'), 'text/html');
    } else if (req.url === '/contact.html') {
        serveStaticFile(path.join(publicPath, 'contact.html'), 'text/html');
    } else if (req.url === '/portfolio.html') {
        serveStaticFile(path.join(publicPath, 'portfolio.html'), 'text/html');
    } else if (req.url === '/login.html') {
        serveStaticFile(path.join(publicPath, 'login.html'), 'text/html');
    } else if (req.url === '/register.html') {
        serveStaticFile(path.join(publicPath, 'register.html'), 'text/html');
    } else if (req.url === '/departments.html') {
        serveStaticFile(path.join(publicPath, 'departments.html'), 'text/html');
    } else if (req.url === '/gallery.html') {
        serveStaticFile(path.join(publicPath, 'gallery.html'), 'text/html');
    } else if (req.url === '/css/main.css') {
        serveStaticFile(path.join(publicPath, 'css', 'main.css'), 'text/css');
    } else if (req.url === '/js/script.js') {
        serveStaticFile(path.join(publicPath, 'js', 'script.js'), 'text/javascript');
    } else if (req.url.startsWith('/assets/images/')) {
        // Serve image files with proper content type
        const imagePath = path.join(publicPath, req.url);
        let contentType = 'image/png';
        if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
        } else if (req.url.endsWith('.gif')) {
            contentType = 'image/gif';
        } else if (req.url.endsWith('.ico')) {
            contentType = 'image/x-icon';
        }
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

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

