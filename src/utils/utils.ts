import { Cheerio, CheerioAPI, Element } from "cheerio";
import { children } from "cheerio/lib/api/traversing";
import { Href } from "./href";

export function getHrefsFromElement($: CheerioAPI, element: Cheerio<Element>){
    const array: Href[] = [];
    const commas = element.children('ul.commas').children();
    for(let i = 0; i < commas.length; i++){
        const child = $(commas[i]);
        array.push({
            name: child.text().trim(),
            href: "https://archiveofourown.org" + child.children("a").attr('href')!
        })
    }
    return array;
}

export function getHrefFromElement(element: Cheerio<Element>): Href|undefined{
    return {
        name: element.text().trim(),
        href: "https://archiveofourown.org" + element.children("ul.commas").children("li").children("a").attr('href')!
    }
}