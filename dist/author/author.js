"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorByName = void 0;
const axios_1 = require("axios");
const cheerio = require("cheerio");
class Author {
    constructor(name) {
        this.recentWorks = [];
        this.name = name;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `https://archiveofourown.org/users/${this.name}/`;
            const html = yield axios_1.default.get(url, {
                headers: {
                    cookie: 'view_adult=true;'
                }
            });
            if (html.status !== 200) {
                return;
            }
            const $ = cheerio.load(html.data);
            return this;
        });
    }
}
function getAuthorByName(username) { }
exports.getAuthorByName = getAuthorByName;
