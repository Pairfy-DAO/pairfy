import {logger} from "@pairfy/common";

const catchError = (error?: any) => {
  logger.error(`EXIT=>${error}`);

  return process.exit(1);
};

export { catchError };
