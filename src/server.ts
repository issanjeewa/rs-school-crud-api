import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { router } from './routes/user.routes';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    const { pathname } = parsedUrl;

    if (pathname && pathname.startsWith('/api')) {
      router(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
