// Vendors
import * as fs from 'fs';
import * as path from 'path';
import type { Session } from './sessionManager.d';
import { getChatMembersCount } from '../../api/apiCalls';
import { logError } from '../customConsole/customConsole';

const SESSION_PATH = path.join(__dirname, '..', '..', 'sessions/');

export const getSession = async (group_id: string): Promise<Session> => {
  let session: Session;
  const file = path.join(SESSION_PATH, 'session' + group_id + '.json');

  try {
    if (!fs.existsSync(SESSION_PATH)) {
      fs.mkdirSync(SESSION_PATH);
    }
    if (fs.existsSync(file)) {
      session = require(file);
    } else {
      const numPersonas: Number = await getChatMembersCount(group_id);
      session = {
        id_grupo: group_id,
        state: 'not_initiated',
        personas: numPersonas,
        personal_status: new Map(),
      };
      fs.appendFileSync(file, JSON.stringify(session, null, 2));
    }
  } catch (err) {
    logError(err);
    return undefined;
  }
  return session;
};

export const setSession = (session: Session): void => {
  const file = path.join(SESSION_PATH, 'session' + session.id_grupo + '.json');
  fs.writeFileSync(file, JSON.stringify(session, null, 2));
};
