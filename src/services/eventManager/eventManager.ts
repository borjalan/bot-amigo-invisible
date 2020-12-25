import { sendChatMessage } from '../../api/apiCalls';
import { VERBOSE } from '../../constants/env';
import {
  EVENT_CHAT_INICIADO,
  EVENT_CHAT_SESSION_ALREADY_INITIATED,
  EVENT_IGNORED,
  EVENT_INITIATE_SESSION,
} from '../../constants/events';
import {
  logEvent,
  logMessage,
  logSession,
  logSessionChanged,
} from '../customConsole/customConsole';
import { setSession } from '../sessionManager/sessionManager';
import { Session } from '../sessionManager/sessionManager.d';

export const handleEvents = (amigoBot: any, message: any, session: Session, mode: string) => {
  if (mode === VERBOSE) {
    logMessage(message);
    logSession(session);
  }
  switch (message.text) {
    case '/iniciar_regalo': {
      if (session.state === 'not_initiated') {
        session.state = 'awaiting_people';
        setSession(session);
        logSessionChanged(session);
        sendChatMessage(session.id_grupo, EVENT_CHAT_INICIADO);
        logEvent(EVENT_INITIATE_SESSION);
      } else {
        sendChatMessage(session.id_grupo, EVENT_CHAT_SESSION_ALREADY_INITIATED);
        ignore(mode);
        break;
      }
    }
    default: {
      ignore(mode);
    }
  }
};

const ignore = mode => {
  if (mode === VERBOSE) {
    logEvent(EVENT_IGNORED);
  }
};
