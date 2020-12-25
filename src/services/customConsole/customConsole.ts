import * as chalk from 'chalk';
import { EVENT_MESSAGE, EVENT_SESSION, EVENT_UPDATE_SESSION } from '../../constants/events';
import { Session } from '../sessionManager/sessionManager.d';

const logBlue = (text: String): void => console.log(chalk.blue(text));
const logBlueBg = (text: String): void => console.log(chalk.bgBlue(text));
const logGreen = (text: String): void => console.log(chalk.green(text));
const logGreenBg = (text: String): void => console.log(chalk.bgGreen(text));
const logRedBg = (text: String): void => console.log(chalk.bgRed(text));
const logMagentaBg = (text: String): void => console.log(chalk.bgMagenta(text));
const logYellowBg = (text: String): void => console.log(chalk.bgYellow(text));
const logYellow = (text: String): void => console.log(chalk.yellow(text));

export const logEvent = (event: string): void => logMagentaBg(event);
export const logError = (error: string): void => logRedBg(error);

export const logMessage = (message: String): void => {
  logBlueBg(EVENT_MESSAGE);
  logBlue(JSON.stringify(message, null, 0));
};

export const logSession = (session: Session): void => {
  logGreenBg(EVENT_SESSION);
  logGreen(JSON.stringify(session, null, 2));
};

export const logSessionChanged = (session: Session): void => {
  logYellowBg(EVENT_UPDATE_SESSION);
  logYellow(JSON.stringify(session, null, 2));
};
