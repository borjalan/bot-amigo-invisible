// Vendors
import * as fs from 'fs';
import * as path from 'path';
import type { Session } from './sessionManager.d';
import { getChatMembersCount } from '../telegramApi/getters';
import { logRedBg } from '../customConsole/customConsole';

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
        state: 'awaiting_start',
        personas: numPersonas,
        personal_status: new Map(),
      };
      fs.appendFileSync(file, JSON.stringify(session));
    }
  } catch (err) {
    logRedBg(err);
    return undefined;
  }
  return session;
};
