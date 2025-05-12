import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { router } from './routes/user.routes';


export const server = http.createServer(
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