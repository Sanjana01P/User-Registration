const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const port = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, 'public');
const registrations = [];

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function collectBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10_000) reject(new Error('Request body is too large'));
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function serveFile(response, fileName, contentType) {
  fs.readFile(path.join(publicDirectory, fileName), (error, content) => {
    if (error) return sendJson(response, 404, { error: 'Not found' });
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && requestUrl.pathname === '/health') {
    return sendJson(response, 200, { status: 'ok' });
  }

  if (request.method === 'POST' && requestUrl.pathname === '/api/register') {
    try {
      const data = JSON.parse(await collectBody(request));
      const name = String(data.name || '').trim();
      const email = String(data.email || '').trim().toLowerCase();
      const attendance = String(data.attendance || '').trim();
      if (!name || !email.includes('@') || !['in-person', 'online'].includes(attendance)) {
        return sendJson(response, 400, { error: 'Name, valid email, and attendance are required' });
      }
      registrations.push({ name, email, attendance, registeredAt: new Date().toISOString() });
      return sendJson(response, 201, { message: `Thanks, ${name}. You are registered!` });
    } catch (error) {
      return sendJson(response, 400, { error: 'Please send valid JSON' });
    }
  }

  if (request.method === 'GET' && requestUrl.pathname === '/') {
    return serveFile(response, 'index.html', 'text/html; charset=utf-8');
  }
  if (request.method === 'GET' && requestUrl.pathname === '/styles.css') {
    return serveFile(response, 'styles.css', 'text/css; charset=utf-8');
  }
  if (request.method === 'GET' && requestUrl.pathname === '/app.js') {
    return serveFile(response, 'app.js', 'text/javascript; charset=utf-8');
  }
  sendJson(response, 404, { error: 'Not found' });
});

server.listen(port, () => console.log(`Event registration listening on port ${port}`));