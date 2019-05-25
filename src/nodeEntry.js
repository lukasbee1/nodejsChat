// Load HTTP module
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  if (req.url === '/') {
    res.statusCode = 302;
    res.setHeader('Location', '/entry');
  } else if (req.url === '/entry') {
    res.write('home');
  } else if (req.url === '/hello') {
    res.write('world');
  } else {
    res.write('404: not found');
  }

  res.end();
});

// listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
