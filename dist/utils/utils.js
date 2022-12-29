"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHrefFromElement = exports.getHrefsFromElement = void 0;
function getHrefsFromElement($, element) {
    const array = [];
    const commas = element.children('ul.commas').children();
    for (let i = 0; i < commas.length; i++) {
        const child = $(commas[i]);
        array.push({
            name: child.text().trim(),
            href: "https://archiveofourown.org" + child.children("a").attr('href')
        });
    }
    return array;
}
exports.getHrefsFromElement = getHrefsFromElement;
function getHrefFromElement(element) {
    return {
        name: element.text().trim(),
        href: "https://archiveofourown.org" + element.children("ul.commas").children("li").children("a").attr('href')
    };
}
exports.getHrefFromElement = getHrefFromElement;
