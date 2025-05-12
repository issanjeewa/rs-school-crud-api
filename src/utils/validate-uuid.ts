import { validate as isValidUUID } from 'uuid';

export const validateUUID = (id: string) => isValidUUID(id);
