import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { children } from 'cheerio/lib/api/traversing';
import { Href } from './href';

export function getHrefsFromElement($: CheerioAPI, element: Cheerio<Element>): Href[] {
    const array: Href[] = [];
    const commas = element.children('ul.commas').children();
    for (let i = 0; i < commas.length; i++) {
        const child = $(commas[i]);
        const tagChild = child.children('a');
        array.push({
            name: tagChild.text(),
            href: 'https://archiveofourown.org' + tagChild.attr('href')!
        });
    }
    return array;
}

export function getHrefFromElement(element: Cheerio<Element>): Href | undefined {
    return {
        name: element.text().trim(),
        href: 'https://archiveofourown.org' + element.attr('href')!
    };
}

export function getHrefsFromListbox($: CheerioAPI, element: Cheerio<Element>): Href[] {
    const array: Href[] = [];
    const treeIndex = element.children('ul[class="tags tree index"]').children();
    for (let i = 0; i < treeIndex.length; i++) {
        const child = $(treeIndex[i]);
        const tagChild = child.children('a');
        array.push({
            name: tagChild.text(),
            href: 'https://archiveofourown.org' + tagChild.attr('href')!
        });
    }
    return array;
}
