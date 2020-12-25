import { EVENT_API_INITIATED } from '../../constants/events';
import { logEvent } from '../customConsole/customConsole';
import { handleEvents } from '../eventManager/eventManager';
import { getSession } from '../sessionManager/sessionManager';

export const setMsgProvider = (amigoBot, mp) => {
  // Set message provider and start API
  amigoBot.setMessageProvider(mp);
  amigoBot
    .start()
    .then(() => {
      logEvent(EVENT_API_INITIATED);
    })
    .catch(console.error);
};

export const mainThread = (amigoBot, mode: string) => {
  // Receive messages via event callback
  amigoBot.on('update', update => {
    const message = update.message;
    getSession(message.chat.id).then(session => {
      handleEvents(amigoBot, message, session, mode);
    });
  });
};
