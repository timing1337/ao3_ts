import { FanficWork } from '../work/work';
import Axios from 'axios';
import * as cheerio from 'cheerio';
import { Href } from '../utils/href';
import { getHrefFromElement, getHrefsFromElement, getHrefsFromListbox } from '../utils/utils';
import { ArchiveWarning, Rating, WorkProgress } from '../utils/enum';

export class TagInformation {
    public tagName: string;

    public parentTags: Href[] = [];
    public relationshipTags: Href[] = [];
    public subTags: Href[] = [];
    public relatedTags: Href[] = [];

    constructor(tagName: string) {
        this.tagName = tagName;
    }

    public async fetch(): Promise<TagInformation | undefined> {
        try {
            let url = encodeURI(`https://archiveofourown.org/tags/${this.tagName}/`);
            const html = await Axios.get(url, {
                headers: {
                    cookie: 'view_adult=true;'
                }
            });
            if (html.status !== 200) {
                return;
            }
            const $ = cheerio.load(html.data);

            this.parentTags = getHrefsFromElement($, $('div[class="parent listbox group"]'));
            this.relatedTags = getHrefsFromElement($, $('div[class="synonym listbox group"]'));
            this.relationshipTags = getHrefsFromElement($, $('div[class="relationships listbox group"]'));
            this.subTags = getHrefsFromListbox($, $('div[class="sub listbox group"]'));
        } catch (ex) {
            return;
        }
        return this;
    }

    public async getRelatedWorks(page: number): Promise<FanficWork[]> {
        try {
            const fanfics: FanficWork[] = [];
            let url = encodeURI(`https://archiveofourown.org/tags/${this.tagName}/works?page=${page}`);
            const html = await Axios.get(url, {
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
                const fanfic = new FanficWork(parseInt(children.attr('id').slice(5)));
                //header module
                const headerModule = children.children(`div[class="header module"]`);
                fanfic.title = headerModule.children(`h4[class="heading"]`).text().trim().split('\n')[0]; //ulgy...
                fanfic.author = getHrefFromElement(headerModule.children(`h4[class="heading"]`).children(`a[rel="author"]`));
                //fandoms heading
                const fandomHeading = headerModule.children(`h5[class="fandoms heading"]`).children();
                for (let i = 0; i < fandomHeading.length; i++) {
                    const fandom = $(fandomHeading[i]);
                    if (!fandom.attr('href')) continue;
                    fanfic.fandom.push(getHrefFromElement(fandom));
                }
                //require tags
                //ignore archive warnings, its in tag module
                const requiredTags = headerModule.children(`ul[class="required-tags"]`).children();
                fanfic.rating = $(requiredTags[0]).text().trim() as Rating;
                fanfic.categories = $(requiredTags[2])
                    .text()
                    .trim()
                    .split(', ')
                    .map((category) => {
                        return {
                            name: category,
                            href: `https://archiveofourown.org/tags/${category.replace('/', '*s*')}/works`
                        } as Href;
                    });
                fanfic.status = $(requiredTags[3]).text().trim() as WorkProgress;
                fanfic.published = headerModule.children(`p[class="datetime"]`).text().trim();

                //tags module
                const tagsModule = children.children(`ul[class="tags commas"]`).children();
                for (let i = 0; i < tagsModule.length; i++) {
                    const tag = $(tagsModule[i]);
                    switch (tag.attr('class')) {
                        case 'warnings':
                            fanfic.archive_warnings.push(tag.text().trim() as ArchiveWarning);
                            break;
                        case 'relationships':
                            fanfic.relationships.push(getHrefFromElement(tag.children(`a[class="tag"]`)));
                            break;
                        case 'characters':
                            fanfic.characters.push(getHrefFromElement(tag.children(`a[class="tag"]`)));
                            break;
                        default:
                            fanfic.additionalTags.push(getHrefFromElement(tag.children(`a[class="tag"]`)));
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
                fanfic.chapters = chapter!;
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
        } catch (ex) {
            return;
        }
    }
}

export async function getTagInformation(tag: string): Promise<TagInformation> {
    return new TagInformation(tag).fetch();
}

export async function getRelatedWorks(tag: string, page: number = 1): Promise<FanficWork[]> {
    return new TagInformation(tag).getRelatedWorks(page);
}
