// src/routes/user.routes.ts
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import {
  handleGetUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from '../controllers';
import { validateUUID } from '../utils';

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  const url = parse(req.url || '', true);
  const method = req.method || 'GET';

  const pathParts = url.pathname?.split('/').filter(Boolean); // ['api', 'users', 'id?']

  if (!pathParts || pathParts[0] !== 'api' || pathParts[1] !== 'users') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Route not found' }));
  }

  const userId = pathParts[2];

  try {
    if (method === 'GET' && pathParts.length === 2) {
      return handleGetUsers(req, res);
    }

    if (method === 'GET' && pathParts.length === 3) {
      if (!validateUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid UUID format' }));
      }
      return handleGetUserById(req, res, userId);
    }

    if (method === 'POST' && pathParts.length === 2) {
      return handleCreateUser(req, res);
    }

    if (method === 'PUT' && pathParts.length === 3) {
      if (!validateUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid UUID format' }));
      }
      return handleUpdateUser(req, res, userId);
    }

    if (method === 'DELETE' && pathParts.length === 3) {
      if (!validateUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid UUID format' }));
      }
      return handleDeleteUser(req, res, userId);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};
