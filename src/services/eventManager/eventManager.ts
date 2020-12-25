import { sendChatMessage } from '../../api/apiCalls';
import { VERBOSE } from '../../constants/env';
import {
  EVENT_CHAT_INICIADO,
  EVENT_CHAT_SESSION_ALREADY_INITIATED,
  EVENT_CHAT_SESSION_NOT_INITIATED,
  EVENT_CHAT_USER_ALREADY_CONFIRMED,
  EVENT_CHAT_USER_CONFIRM,
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
import { Session, UserState } from '../sessionManager/sessionManager.d';

const ignore = mode => {
  if (mode === VERBOSE) {
    logEvent(EVENT_IGNORED);
  }
};

const checkUserParticipation = (user_id: String, session: Session): Boolean => {
  let present = false;
  session.personal_status.forEach(user => {
    if (user.user_id === user_id) {
      present = true;
    }
  });
  return present;
};

export const handleEvents = (amigoBot: any, message: any, session: Session, mode: String) => {
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
      }
      break;
    }
    case '/participo': {
      if (session.state === 'awaiting_people') {
        if (!checkUserParticipation(message.from.id, session)) {
          console.log(session);
          const state: UserState = 'participation_confirmed';
          session.personal_status.push({ user_id: message.from.id, state });
          console.log(session);
          setSession(session);
          logSessionChanged(session);
          sendChatMessage(session.id_grupo, '@' + message.from.username + EVENT_CHAT_USER_CONFIRM);
          logEvent(EVENT_INITIATE_SESSION);
        } else {
          sendChatMessage(
            session.id_grupo,
            '@' + message.from.username + EVENT_CHAT_USER_ALREADY_CONFIRMED
          );
          ignore(mode);
        }
      } else {
        sendChatMessage(session.id_grupo, EVENT_CHAT_SESSION_NOT_INITIATED);
        ignore(mode);
      }
      break;
    }
    default: {
      ignore(mode);
    }
  }
};
