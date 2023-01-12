"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedWorks = exports.getTagInformation = exports.getAuthorByName = exports.getWorkFromId = void 0;
var work_1 = require("./work/work");
Object.defineProperty(exports, "getWorkFromId", { enumerable: true, get: function () { return work_1.getWorkFromId; } });
var author_1 = require("./author/author");
Object.defineProperty(exports, "getAuthorByName", { enumerable: true, get: function () { return author_1.getAuthorByName; } });
var tag_1 = require("./tag/tag");
Object.defineProperty(exports, "getTagInformation", { enumerable: true, get: function () { return tag_1.getTagInformation; } });
Object.defineProperty(exports, "getRelatedWorks", { enumerable: true, get: function () { return tag_1.getRelatedWorks; } });