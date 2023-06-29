"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorByName = void 0;
const axios_1 = require("axios");
const cheerio = require("cheerio");
class Author {
    constructor(name) {
        this.recentWorks = [];
        this.name = name;
    }
    async fetch() {
        try {
            let url = `https://archiveofourown.org/users/${this.name}/`;
            const html = await axios_1.default.get(url, {
                headers: {
                    cookie: 'view_adult=true;'
                }
            });
            if (html.status !== 200) {
                return;
            }
            const $ = cheerio.load(html.data);
        }
        catch (ex) { }
        return this;
    }
}
function getAuthorByName(username) { }
exports.getAuthorByName = getAuthorByName;
