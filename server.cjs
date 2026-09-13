const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 3000);
const files = {
  '/': ['main.html', 'text/html; charset=utf-8'],
  '/main.html': ['main.html', 'text/html; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8'],
};

const server = http.createServer((req, res) => {
  const pathname = (req.url || '/').split('?')[0];
  const file = Object.hasOwn(files, pathname) ? files[pathname] : undefined;
  if (!file) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  fs.readFile(path.join(__dirname, file[0]), (error, data) => {
    if (error) {
      res.writeHead(500);
      res.end('Unable to read file');
      return;
    }
    res.writeHead(200, { 'Content-Type': file[1] });
    res.end(data);
  });
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Stop the existing server or set PORT.`
    : error.message);
  process.exit(1);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Subway app: http://localhost:${port}`);
  console.log('Press Ctrl+C to stop.');
});
