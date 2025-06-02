"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNickname = void 0;
const unique_names_generator_1 = require("unique-names-generator");
const nanoid_1 = require("nanoid");
const getUserNickname = () => {
    const customConfig = {
        dictionaries: [unique_names_generator_1.colors, unique_names_generator_1.animals],
        separator: "_",
        length: 2,
        style: "capital",
    };
    const nickname = (0, unique_names_generator_1.uniqueNamesGenerator)(customConfig);
    let nid = (0, nanoid_1.customAlphabet)("0123456789", 4)();
    return nickname + nid;
};
exports.getUserNickname = getUserNickname;
