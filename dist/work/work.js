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
exports.getWorkFromId = exports.FanficWork = void 0;
const axios_1 = require("axios");
const cheerio = require("cheerio");
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils/utils");
class FanficWork {
    constructor(workId) {
        this.status = enum_1.WorkProgress.NONE;
        this.archive_warnings = [];
        this.categories = [];
        this.fandom = [];
        this.relationships = [];
        this.characters = [];
        this.additionalTags = [];
        this.commentsCount = 0;
        this.kudosCount = 0;
        this.hitsCount = 0;
        this.bookmarksCount = 0;
        this.notes = [];
        this.workId = workId;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = `https://archiveofourown.org/works/${this.workId}/`;
                const html = yield axios_1.default.get(url, {
                    headers: {
                        cookie: 'view_adult=true;'
                    }
                });
                if (html.status !== 200) {
                    return;
                }
                const $ = cheerio.load(html.data);
                this.rating = $('dd.rating').text().trim();
                this.archive_warnings = (0, utils_1.getHrefsFromElement)($, $('dd.warning')).map((href) => {
                    return href.name;
                });
                this.categories = (0, utils_1.getHrefsFromElement)($, $('dd.category'));
                this.fandom = (0, utils_1.getHrefsFromElement)($, $('dd.fandom'));
                this.relationships = (0, utils_1.getHrefsFromElement)($, $('dd.relationship'));
                this.characters = (0, utils_1.getHrefsFromElement)($, $('dd.character'));
                this.additionalTags = (0, utils_1.getHrefsFromElement)($, $('dd.freeform'));
                this.published = $('dd.published').text().trim();
                this.words = parseInt($('dd.words').text().trim());
                const [chapter, maxChapters] = $('dd.chapters')
                    .text()
                    .trim()
                    .split('/')
                    .map((value) => {
                    return value !== '?' ? parseInt(value) : undefined;
                });
                this.chapters = chapter;
                this.maxChapters = maxChapters;
                if ($('dd.comments').length !== 0) {
                    this.commentsCount = parseInt($('dd.comments').text().trim());
                }
                if ($('dd.kudos').length !== 0) {
                    this.kudosCount = parseInt($('dd.kudos').text().trim());
                }
                if ($('dd.hits').length !== 0) {
                    this.hitsCount = parseInt($('dd.hits').text().trim());
                }
                if ($('dd.bookmarks').length !== 0) {
                    this.bookmarksCount = parseInt($('dd.bookmarks').text().trim());
                }
                this.title = $('h2.title').text().trim();
                this.author = (0, utils_1.getHrefFromElement)($('a[rel="author"]'));
                this.notes = [$('div[class="notes module"]').children('blockquote.userstuff').children('p').text().trim(), $('div[class="end notes module"]').children('blockquote.userstuff').children('p').text().trim()];
                return this;
            }
            catch (ex) {
                return;
            }
        });
    }
}
exports.FanficWork = FanficWork;
function getWorkFromId(workId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new FanficWork(workId).fetch();
    });
}
exports.getWorkFromId = getWorkFromId;
