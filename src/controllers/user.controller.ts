import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';

import { users } from '../database';
import { User } from '../models';

const parseRequestBody = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
};

export const handleGetUsers = (_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const handleGetUserById = (
  _req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

export const handleCreateUser = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const { username, age, hobbies } = await parseRequestBody(req);

    if (
      typeof username !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies) ||
      !hobbies.every((h) => typeof h === 'string')
    ) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Invalid user data' }));
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };

    users.push(newUser);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid JSON body' }));
  }
};

export const handleUpdateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }

  try {
    const { username, age, hobbies } = await parseRequestBody(req);

    if (
      typeof username !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies) ||
      !hobbies.every((h) => typeof h === 'string')
    ) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Invalid user data' }));
    }

    const updatedUser = {
      id: userId,
      username,
      age,
      hobbies,
    };

    users[userIndex] = updatedUser;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid JSON body' }));
  }
};

export const handleDeleteUser = (
  _req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }

  users.splice(index, 1);
  res.writeHead(204);
  res.end();
};
