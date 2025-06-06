"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.article = void 0;
exports.article = {
    "$schema": "https://json-schema.org/draft-04/schema#",
    "id": "/article",
    "title": "Article",
    "description": "An article in the blog",
    "type": "object",
    "properties": {
        "title": {
            "description": "Main tilte of the blog article",
            "type": "string"
        },
        "allText": {
            "description": "Body text of the blog article",
            "type": "string"
        },
        "summary": {
            "description": "Optional short text summary of article",
            "type": "string"
        },
        "imageURL": {
            "description": "URL for main image to show in article",
        },
        "published": {
            "description": "Is the article published or not",
            "type": "boolean"
        },
        "authorID": {
            "description": "User ID of the article author",
            "type": "integer",
            "minimum": 0
        },
    },
    "required": ["title", "allText", "authorID"]
};
