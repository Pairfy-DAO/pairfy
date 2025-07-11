import { getNotifications } from "./notification/getNotifications.js";
import { editNotifications } from "./notification/editNotifications.js";
import { getCursor } from "./notification/getCursor.js";


export const notification = {
  Query: {
    getNotifications,
    getCursor
  },
  Mutation: {
    editNotifications,
  },
};
