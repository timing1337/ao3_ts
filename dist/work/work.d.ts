import { Href } from '../utils/href';
declare class FanficWork {
    workId: number;
    rating: Rating;
    archive_warnings: ArchiveWarning[];
    categories: Href[];
    fandom: Href[];
    relationships: Href[];
    characters: Href[];
    additionalTags: Href[];
    language: string;
    published: string;
    words: number;
    chapters: number;
    maxChapters: number | undefined;
    commentsCount: number;
    kudosCount: number;
    hitsCount: number;
    bookmarksCount: number;
    title: string;
    author: Href;
    summary: string;
    notes: string[];
    constructor(workId: number);
    fetch(): Promise<FanficWork | undefined>;
}
export declare function getWorkFromId(workId: number): Promise<FanficWork | undefined>;
export {};
