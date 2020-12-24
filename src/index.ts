// Vendors
import * as NodeBot from 'telegram-bot-api';

// Services
import { mainThread, setMsgProvider } from './services/botServices/initBot';

// Constants
import { HTTP_API_TOKEN } from './constants/secrets';

const amigoBot = new NodeBot({
  token: HTTP_API_TOKEN,
});
const mp = new NodeBot.GetUpdateMessageProvider();

setMsgProvider(amigoBot, mp);
mainThread(amigoBot);
