import chalk from "chalk";
import ora from "ora";

export const log = {
  warn: (msg) => {
    console.log("%s", chalk.yellow(msg));
  },
  error: (msg) => {
    console.log("%s", chalk.red(msg));
  },
  suc: (msg) => {
    console.log("%s", chalk.green(msg));
  },
};

export const createLoading = (msg) => {
  const spinner = ora(msg).start();
  return spinner;
};
