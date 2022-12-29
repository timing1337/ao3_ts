import Axios from 'axios';
import * as cheerio from 'cheerio';

enum Rating{
    NOT_RATED = "Not Rated",
    GENERAL_AUDIENCES = "General Audiences",
    TEEN_AND_UP_AUDIENCES = "Teen And Up Audiences",
    MATURE = "Mature",
    EXPLICIT = "Explicit",
}

class FanficWork{

    public workId: number;
    public chapterId: number;

    public rating: Rating;
    public fandom: string;
    public relationships: string[] = [];

    constructor(workId: number, chapterId?: number){
        this.workId = workId;
    }

    public async fetch(): Promise<FanficWork|undefined>{
        let url = `https://archiveofourown.org/works/${this.workId}/`;
        if(this.chapterId){
            url += `chapters/${this.chapterId}/`
        }
        const html = await Axios.get(url, {
            headers: {
                cookie: 'view_adult=true;'
            }
        });
        if(html.status !== 200){
            return 
        }
        const $ = cheerio.load(html.data);
        this.rating = $("dd.rating").text().trim() as Rating
        this.fandom = $("dd.fandom").text().trim();
        // todo figure out this PIECE OF SHIT
        // @ts-ignore
        const relationships = $("dd.relationship").toArray()[0].children[1].children;
        for(const relationship of relationships){
            if(relationship.name !== "li") continue;
            this.relationships.push(relationship.children[0].children[0].data);
        }
        return this;
    }
}

export async function getWorkFromId(workId: number, chapterId?: number): Promise<FanficWork|undefined>{
    return await (new FanficWork(workId, chapterId)).fetch();
}