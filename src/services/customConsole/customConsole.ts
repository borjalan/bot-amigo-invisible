import * as chalk from 'chalk';

export const logBlue = (text: String): void => {
  console.log(chalk.blue(text));
};

export const logGreen = (text: String): void => {
  console.log(chalk.green(text));
};

export const logRedBg = (text: String): void => {
  console.log(chalk.bgRed(text));
};

export const logGreenBg = (text: String): void => {
  console.log(chalk.bgGreen(text));
};
