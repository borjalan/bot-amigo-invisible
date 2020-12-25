// Vendors
import * as NodeBot from 'telegram-bot-api';

// Services
import { mainThread, setMsgProvider } from './services/botServices/initBot';

// Constants
import { HTTP_API_TOKEN } from './constants/secrets';
import { SILENT, VERBOSE } from './constants/env';
import { VERBOSE_PARAM } from './constants/argv';
import { logEvent } from './services/customConsole/customConsole';
import { EVENT_VERBOSE_MODE } from './constants/events';

const amigoBot = new NodeBot({
  token: HTTP_API_TOKEN,
});
const mp = new NodeBot.GetUpdateMessageProvider();
let mode = SILENT;

process.argv.forEach(function (val) {
  if (VERBOSE_PARAM.includes(val)) {
    logEvent(EVENT_VERBOSE_MODE);
    mode = VERBOSE;
  }
});

setMsgProvider(amigoBot, mp);
mainThread(amigoBot, mode);
