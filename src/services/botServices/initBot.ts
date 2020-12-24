import { logBlue, logGreen, logGreenBg } from '../customConsole/customConsole';
import { getSession } from '../sessionManager/sessionManager';

export const setMsgProvider = (amigoBot, mp) => {
  // Set message provider and start API
  amigoBot.setMessageProvider(mp);
  amigoBot
    .start()
    .then(() => {
      logGreenBg('API is started');
    })
    .catch(console.error);
};

export const mainThread = amigoBot => {
  // Receive messages via event callback
  amigoBot.on('update', update => {
    const message = update.message;
    logBlue('Mensaje Recibido\n' + JSON.stringify(message, null, 2));
    getSession(message.chat.id).then(session => {
      logGreen(JSON.stringify(session, null, 2));
    });
  });
};
