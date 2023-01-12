"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHrefsFromListbox = exports.getHrefFromElement = exports.getHrefsFromElement = void 0;
function getHrefsFromElement($, element) {
    const array = [];
    const commas = element.children('ul.commas').children();
    for (let i = 0; i < commas.length; i++) {
        const child = $(commas[i]);
        const tagChild = child.children('a');
        array.push({
            name: tagChild.text(),
            href: 'https://archiveofourown.org' + tagChild.attr('href')
        });
    }
    return array;
}
exports.getHrefsFromElement = getHrefsFromElement;
function getHrefFromElement(element) {
    return {
        name: element.text().trim(),
        href: 'https://archiveofourown.org' + element.attr('href')
    };
}
exports.getHrefFromElement = getHrefFromElement;
function getHrefsFromListbox($, element) {
    const array = [];
    const treeIndex = element.children('ul[class="tags tree index"]').children();
    for (let i = 0; i < treeIndex.length; i++) {
        const child = $(treeIndex[i]);
        const tagChild = child.children('a');
        array.push({
            name: tagChild.text(),
            href: 'https://archiveofourown.org' + tagChild.attr('href')
        });
    }
    return array;
}
exports.getHrefsFromListbox = getHrefsFromListbox;
