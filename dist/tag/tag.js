"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedWorks = exports.getTagInformation = exports.TagInformation = void 0;
const work_1 = require("../work/work");
const axios_1 = require("axios");
const cheerio = require("cheerio");
const utils_1 = require("../utils/utils");
class TagInformation {
    constructor(tagName) {
        this.parentTags = [];
        this.relationshipTags = [];
        this.subTags = [];
        this.relatedTags = [];
        this.tagName = tagName;
    }
    async fetch() {
        try {
            let url = encodeURI(`https://archiveofourown.org/tags/${this.tagName}/`);
            const html = await axios_1.default.get(url, {
                headers: {
                    cookie: 'view_adult=true;'
                }
            });
            if (html.status !== 200) {
                return;
            }
            const $ = cheerio.load(html.data);
            this.parentTags = (0, utils_1.getHrefsFromElement)($, $('div[class="parent listbox group"]'));
            this.relatedTags = (0, utils_1.getHrefsFromElement)($, $('div[class="synonym listbox group"]'));
            this.relationshipTags = (0, utils_1.getHrefsFromElement)($, $('div[class="relationships listbox group"]'));
            this.subTags = (0, utils_1.getHrefsFromListbox)($, $('div[class="sub listbox group"]'));
        }
        catch (ex) {
            return;
        }
        return this;
    }
    async getRelatedWorks(page) {
        try {
            const fanfics = [];
            let url = encodeURI(`https://archiveofourown.org/tags/${this.tagName}/works?page=${page}`);
            const html = await axios_1.default.get(url, {
                headers: {
                    cookie: 'view_adult=true;'
                }
            });
            if (html.status !== 200) {
                return;
            }
            const $ = cheerio.load(html.data);
            const workIndexGroup = $(`ol[class="work index group"]`).children();
            //i know we can just fetch them again but we cant risk getting ratelimited so... :/
            //this gonna be wilddddd
            for (let i = 0; i < workIndexGroup.length; i++) {
                const children = $(workIndexGroup[i]);
                const fanfic = new work_1.FanficWork(parseInt(children.attr('id').slice(5)));
                //header module
                const headerModule = children.children(`div[class="header module"]`);
                fanfic.title = headerModule.children(`h4[class="heading"]`).text().trim().split('\n')[0]; //ulgy...
                fanfic.author = (0, utils_1.getHrefFromElement)(headerModule.children(`h4[class="heading"]`).children(`a[rel="author"]`));
                //fandoms heading
                const fandomHeading = headerModule.children(`h5[class="fandoms heading"]`).children();
                for (let i = 0; i < fandomHeading.length; i++) {
                    const fandom = $(fandomHeading[i]);
                    if (!fandom.attr('href'))
                        continue;
                    fanfic.fandom.push((0, utils_1.getHrefFromElement)(fandom));
                }
                //require tags
                //ignore archive warnings, its in tag module
                const requiredTags = headerModule.children(`ul[class="required-tags"]`).children();
                fanfic.rating = $(requiredTags[0]).text().trim();
                fanfic.categories = $(requiredTags[2])
                    .text()
                    .trim()
                    .split(', ')
                    .map((category) => {
                    return {
                        name: category,
                        href: `https://archiveofourown.org/tags/${category.replace('/', '*s*')}/works`
                    };
                });
                fanfic.status = $(requiredTags[3]).text().trim();
                fanfic.published = headerModule.children(`p[class="datetime"]`).text().trim();
                //tags module
                const tagsModule = children.children(`ul[class="tags commas"]`).children();
                for (let i = 0; i < tagsModule.length; i++) {
                    const tag = $(tagsModule[i]);
                    switch (tag.attr('class')) {
                        case 'warnings':
                            fanfic.archive_warnings.push(tag.text().trim());
                            break;
                        case 'relationships':
                            fanfic.relationships.push((0, utils_1.getHrefFromElement)(tag.children(`a[class="tag"]`)));
                            break;
                        case 'characters':
                            fanfic.characters.push((0, utils_1.getHrefFromElement)(tag.children(`a[class="tag"]`)));
                            break;
                        default:
                            fanfic.additionalTags.push((0, utils_1.getHrefFromElement)(tag.children(`a[class="tag"]`)));
                            break;
                    }
                }
                //blockquote
                const blockquote = children.children(`blockquote[class="userstuff summary"]`).children();
                for (let i = 0; i < blockquote.length; i++) {
                    const quote = $(blockquote[i]);
                    fanfic.notes.push(quote.text().trim());
                }
                const stats = children.children(`dl[class="stats"]`);
                fanfic.words = parseInt(stats.children('dd.words').text().replaceAll(",", "").trim());
                const [chapter, maxChapters] = stats
                    .children('dd.chapters')
                    .text()
                    .trim()
                    .split('/')
                    .map((value) => {
                    return value !== '?' ? parseInt(value) : undefined;
                });
                fanfic.chapters = chapter;
                fanfic.maxChapters = maxChapters;
                if (stats.children('dd.comments').length !== 0) {
                    fanfic.commentsCount = parseInt(stats.children('dd.comments').text().replaceAll(",", "").trim());
                }
                if (stats.children('dd.kudos').length !== 0) {
                    fanfic.kudosCount = parseInt(stats.children('dd.kudos').text().replaceAll(",", "").trim());
                }
                if (stats.children('dd.hits').length !== 0) {
                    fanfic.hitsCount = parseInt(stats.children('dd.hits').text().replaceAll(",", "").trim());
                }
                if (stats.children('dd.bookmarks').length !== 0) {
                    fanfic.bookmarksCount = parseInt(stats.children('dd.bookmarks').text().replaceAll(",", "").trim());
                }
                fanfics.push(fanfic);
            }
            return fanfics;
        }
        catch (ex) {
            return;
        }
    }
}
exports.TagInformation = TagInformation;
async function getTagInformation(tag) {
    return new TagInformation(tag).fetch();
}
exports.getTagInformation = getTagInformation;
async function getRelatedWorks(tag, page = 1) {
    return new TagInformation(tag).getRelatedWorks(page);
}
exports.getRelatedWorks = getRelatedWorks;
