import Axios from 'axios';
import * as cheerio from 'cheerio';
import { Author } from '../author/author';
import { Href } from '../utils/href';
import { getHrefsFromElement } from '../utils/utils';

class FanficWork{

    public workId: number;

    public rating: Rating;
    public archive_warnings: ArchiveWarning[] = [];
    public categories: Href[] = [];
    public fandom: Href[] = [];
    public relationships: Href[] = [];
    public characters: Href[] = [];
    public additionalTags: Href[] = [];
    public language: string;

    public published: string;
    public words: number;
    public chapters: number;
    public maxChapters: number|undefined;
    public commentsCount: number;
    public kudosCount: number;
    public hitsCount: number;
    public bookmarksCount: number = 0;

    public title: string;
    public author: Href;
    public summary: string;
    public notes: string[] = [];

    constructor(workId: number){
        this.workId = workId;
    }

    public async fetch(): Promise<FanficWork|undefined>{
        let url = `https://archiveofourown.org/works/${this.workId}/`;
        const html = await Axios.get(url, {
            headers: {
                cookie: 'view_adult=true;'
            }
        });
        if(html.status !== 200){
            return;
        }
        const $ = cheerio.load(html.data);

        this.rating = $("dd.rating").text().trim() as Rating
        this.archive_warnings = getHrefsFromElement($, $("dd.warning")).map(href => {
            return href.name as ArchiveWarning;
        });
        this.categories = getHrefsFromElement($, $('dd.category'));
        this.fandom = getHrefsFromElement($, $('dd.fandom'));
        this.relationships = getHrefsFromElement($, $('dd.relationship'));
        this.characters = getHrefsFromElement($, $('dd.character'))
        this.additionalTags = getHrefsFromElement($, $('dd.freeform'))

        this.published = $('dd.published').text().trim();
        this.words = parseInt($('dd.words').text().trim());
        
        const [chapter, maxChapters] = $("dd.chapters").text().trim().split("/").map(value => {
            return value !== "?" ? parseInt(value) : undefined
        })

        this.chapters = chapter!;
        this.maxChapters = maxChapters;
        this.commentsCount = parseInt($('dd.comments').text().trim());
        this.kudosCount = parseInt($('dd.kudos').text().trim());
        this.hitsCount = parseInt($('dd.hits').text().trim())
        if($("dd.bookmarks").length !== 0){
            this.bookmarksCount = parseInt($('dd.bookmarks').text().trim());
        }

        this.title = $('h2.title').text().trim();

        const author = $('a[rel="author"]');
        this.author = {
            name: author.text().trim(),
            href: "https://archiveofourown.org" + author.attr('href')!
        }

        this.notes = [
            $('div[class="notes module"]').children("blockquote.userstuff").children("p").text().trim(),
            $('div[class="end notes module"]').children("blockquote.userstuff").children("p").text().trim(),
        ]
        return this;
    }
}

export async function getWorkFromId(workId: number): Promise<FanficWork|undefined>{
    return await (new FanficWork(workId)).fetch();
}