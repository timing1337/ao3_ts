"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkProgress = exports.ArchiveWarning = exports.Rating = void 0;
var Rating;
(function (Rating) {
    Rating["NOT_RATED"] = "Not Rated";
    Rating["GENERAL_AUDIENCES"] = "General Audiences";
    Rating["TEEN_AND_UP_AUDIENCES"] = "Teen And Up Audiences";
    Rating["MATURE"] = "Mature";
    Rating["EXPLICIT"] = "Explicit";
})(Rating = exports.Rating || (exports.Rating = {}));
var ArchiveWarning;
(function (ArchiveWarning) {
    ArchiveWarning["CREATOR_IGNORES_ARCHIVE_WARNINGS"] = "Creator Chose Not To Use Archive Warnings";
    ArchiveWarning["NO_ARCHIVE_WARNINGS"] = "No Archive Warnings Apply";
    ArchiveWarning["GRAPHIC"] = "Graphic Depictions Of Violence";
    ArchiveWarning["CHARACTER_DEATH"] = "Major Character Death";
    ArchiveWarning["UNDERAGE"] = "Underage";
    ArchiveWarning["NON_CON"] = "Rape/Non-Con"; //god please github dont get butthurt
})(ArchiveWarning = exports.ArchiveWarning || (exports.ArchiveWarning = {}));
var WorkProgress;
(function (WorkProgress) {
    WorkProgress["NONE"] = "";
    WorkProgress["IN_PROGRESS"] = "Work in Progress";
    WorkProgress["COMPLETE_WORK"] = "Complete Work";
})(WorkProgress = exports.WorkProgress || (exports.WorkProgress = {}));
