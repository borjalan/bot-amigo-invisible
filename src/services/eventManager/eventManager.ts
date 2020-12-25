import { getChatMember, pinChatMessage, sendChatMessage } from '../../api/apiCalls';
import { COMMAND_DEAL, COMMAND_INITIATE, COMMAND_PARTICIPATE } from '../../constants/command';
import { VERBOSE } from '../../constants/env';
import {
  EVENT_CHAT_INICIADO,
  EVENT_CHAT_NOT_ENOUGH_USERS,
  EVENT_CHAT_SESSION_ALREADY_INITIATED,
  EVENT_CHAT_SESSION_NOT_INITIATED,
  EVENT_CHAT_TARGET_USER,
  EVENT_CHAT_USERS_DEALED,
  EVENT_CHAT_USER_ALREADY_CONFIRMED,
  EVENT_CHAT_USER_CONFIRM,
  EVENT_FINISH_SESSION,
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

const shuffle = array => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const handleEvents = async (message: any, session: Session, mode: String) => {
  if (mode === VERBOSE) {
    logMessage(message);
    logSession(session);
  }
  switch (message.text) {
    case COMMAND_INITIATE: {
      if (session.state === 'not_initiated') {
        session.state = 'awaiting_people';
        setSession(session);
        logSessionChanged(session);
        const lastMsg = await sendChatMessage(session.id_grupo, EVENT_CHAT_INICIADO);
        await pinChatMessage(session.id_grupo, lastMsg.message_id, false);
        logEvent(EVENT_INITIATE_SESSION);
      } else {
        sendChatMessage(session.id_grupo, EVENT_CHAT_SESSION_ALREADY_INITIATED);
        ignore(mode);
      }
      break;
    }
    case COMMAND_PARTICIPATE: {
      if (session.state === 'awaiting_people') {
        if (!checkUserParticipation(message.from.id, session)) {
          const state: UserState = 'participation_confirmed';
          session.personal_status.push({ user_id: message.from.id, state });
          setSession(session);
          sendChatMessage(session.id_grupo, '@' + message.from.username + EVENT_CHAT_USER_CONFIRM);
          if (mode === VERBOSE) {
            logSessionChanged(session);
          }
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
    case COMMAND_DEAL: {
      if (session.state === 'awaiting_people') {
        if (session.personal_status.length >= 3) {
          session.personal_status = shuffle(session.personal_status);
          session.personal_status.forEach(async (user, index, users) => {
            const targetIndex = (index + 1) % users.length;
            const target = await getChatMember(session.id_grupo, users[targetIndex].user_id);
            await sendChatMessage(
              user.user_id,
              EVENT_CHAT_TARGET_USER + '@' + target.user.username
            );
          });
          sendChatMessage(session.id_grupo, EVENT_CHAT_USERS_DEALED);
          session.personal_status = [];
          session.state = 'not_initiated';
          setSession(session);
          if (mode === VERBOSE) {
            logSessionChanged(session);
          }
          logEvent(EVENT_FINISH_SESSION);
        } else {
          sendChatMessage(session.id_grupo, EVENT_CHAT_NOT_ENOUGH_USERS);
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
