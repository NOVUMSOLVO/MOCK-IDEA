const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = '';
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'login-success.html');
  } else if (req.url === '/test') {
    filePath = path.join(__dirname, 'test-frontend-api.html');
  } else {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`🌐 Test server running on http://localhost:${PORT}`);
  console.log(`📝 Main test page: http://localhost:${PORT}/`);
  console.log(`🔧 API test page: http://localhost:${PORT}/test`);
  console.log(`🔗 Backend API: http://localhost:3002`);
});
