import Axios from 'axios';
import * as cheerio from 'cheerio';
import { FanficWork } from '../work/work';

class Author {
    public name: string;
    public joinDate: string;
    public userId: number;

    public recentWorks: FanficWork[] = [];

    public constructor(name: string) {
        this.name = name;
    }

    public async fetch(): Promise<Author | undefined> {
        let url = `https://archiveofourown.org/users/${this.name}/`;
        const html = await Axios.get(url, {
            headers: {
                cookie: 'view_adult=true;'
            }
        });
        if (html.status !== 200) {
            return;
        }
        const $ = cheerio.load(html.data);
        return this;
    }
}

export function getAuthorByName(username: string) {}
