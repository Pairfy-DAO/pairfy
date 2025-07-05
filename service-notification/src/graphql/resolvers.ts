import { getNotifications } from "./notification/getNotifications.js";
import { editNotifications } from "./notification/editNotifications.js";


export const notification = {
  Query: {
    getNotifications,
  },
  Mutation: {
    editNotifications,
  },
};
