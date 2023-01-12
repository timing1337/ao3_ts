import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { Href } from './href';
export declare function getHrefsFromElement($: CheerioAPI, element: Cheerio<Element>): Href[];
export declare function getHrefFromElement(element: Cheerio<Element>): Href | undefined;
export declare function getHrefsFromListbox($: CheerioAPI, element: Cheerio<Element>): Href[];
