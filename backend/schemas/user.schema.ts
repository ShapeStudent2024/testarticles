export const user = {
    "$schema": "https://json-schema.org/draft-04/schema#",
    "id": "/user",
    "title": "User",
    "description": "A user in the blog system",
    "type": "object",
    "properties": {
        "username": {
            "description": "Username of the user",
            "type": "string"
        },
        "email": {
            "description": "User's email",
            "type": "string"
        },
        "password":{
            "description": "User's password for authentication",
            "type": "string"
        },
        "firstname":{
            "description": "User's first name",
            "type": "string"
        },
        "lastname":{
            "description": "User's last name",
            "type": "string"
        },
        "avatarurl":{
            "description": "URL for user",
            "type": "string",
            "format": "uri"
        },
        "about":{
            "description": "User's introduction",
            "type": "string"
        },
    },
    "required": ["username", "email"]
}