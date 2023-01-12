import { FanficWork } from '../work/work';
import { Href } from '../utils/href';
export declare class TagInformation {
    tagName: string;
    parentTags: Href[];
    relationshipTags: Href[];
    subTags: Href[];
    relatedTags: Href[];
    constructor(tagName: string);
    fetch(): Promise<TagInformation | undefined>;
    getRelatedWorks(page: number): Promise<FanficWork[]>;
}
export declare function getTagInformation(tag: string): Promise<TagInformation>;
export declare function getRelatedWorks(tag: string, page?: number): Promise<FanficWork[]>;
