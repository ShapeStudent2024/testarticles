CREATE TABLE public.trips (
    id serial4 NOT NULL,
    destination varchar(100) NOT NULL,
    description text NOT NULL,
    startDate date NOT NULL,
    endDate date NOT NULL,
    datecreated timestamp NOT NULL DEFAULT now(),
    datemodified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    imageurl varchar(2048) NULL,
    isPublic bool NULL,
    travelerID int4 NOT NULL,
    CONSTRAINT trips_pkey PRIMARY KEY (id)
);

INSERT INTO trips (destination, description, startDate, endDate, travelerID) VALUES
    ('Paris', 'A romantic trip to explore the Eiffel Tower and Louvre', '2025-06-01', '2025-06-07', 1),
    ('Tokyo', 'Discovering Japanese culture and cuisine', '2025-07-15', '2025-07-22', 1),
    ('New York', 'City adventure with Broadway shows', '2025-08-10', '2025-08-15', 1),
    ('Bali', 'Relaxing beach getaway with temple visits', '2025-09-01', '2025-09-10', 3);


user sql
CREATE TABLE public.users (
	id serial4 NOT NULL,
	firstname varchar(32) NULL,
	lastname varchar(32) NULL,
	username varchar(16) NOT NULL,
	about text NULL,
	dateregistered timestamp NOT NULL DEFAULT now(),
	"password" varchar(32) NULL,
	passwordsalt varchar(16) NULL,
	email varchar(64) NOT NULL,
	avatarurl varchar(64) NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username)
);

INSERT INTO users (username, email) VALUES
	('alice', 'alice@example.com'),
	('bob', 'bob@example.com'),
	('colin', 'colin@example.com');

---
backend/controllers/auth.ts
import passport from "koa-passport";
import { BasicStrategy } from "passport-http";
import { RouterContext } from "koa-router";

import * as users from "../models/users";

const verifyPassword = (user:any, password:string) => {
    return user.password === password;
}

passport.use(new BasicStrategy(async (username: string, password: string, done) => {
    if(username === 'admin' && password === 'password') {
        done(null, {username: 'admin'});
    } else {
        done(null, false);
    }

    let result: any[] = [];
    try {
        result = await users.findByUsername(username);
    } catch(error: any) {
        console.error(`Error authentication for user ${username}: ${error}`);
        done(null, false);
    }
    if(result.length) {
        const user = result[0];
        if(verifyPassword(user, password)) {
            done(null, user);
        } else {
            console.log(`Password incorrect for ${username}`);
            done(null, false);
        }
    } else {
        console.log(`${username} is not found`);
        done(null, false);
    }

}));

export const basicAuth = async (ctx: RouterContext, next: any) => {
    await passport.authenticate('basic', { session: false })(ctx, next);
    if(ctx.status == 401){
        ctx.body = {
            msg: 'You are not authorized'
        }
    }else {
        ctx.body = {
            msg: 'You are authorized',
            data: ctx.state
        }
       return ctx.state
    }
}

backend/controllers/validation.ts
import { Validator, ValidationError } from 'jsonschema';
import { RouterContext } from 'koa-router';
import { article } from '../schemas/article.schema';
import { user } from '../schemas/user.schema';

const v = new Validator();

export const validateArticle = async(ctx: RouterContext, next: any) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    }

    const body = ctx.request.body;

    try{
        v.validate(body, article, validationOptions);
        await next();
    }catch(error){
        if( error instanceof ValidationError ){
            ctx.body = error;
            ctx.status = 400;
        }else{
            throw error;
        }
    }
}

export const validateUser = async(ctx: RouterContext, next: any) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    }

    const body = ctx.request.body;

    try{
        v.validate(body, user, validationOptions);
        await next();
    }catch(error){
        if( error instanceof ValidationError ){
            ctx.body = error;
            ctx.status = 400;
        }else{
            throw error;
        }
    }
}

backend/helpers/database.ts
import { Sequelize, QueryTypes } from "sequelize";
import config from "../config";

export const run_query = async (query:any, values:any) => {
    try{
        const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
        await sequelize.authenticate();
        let data = await sequelize.query(query, {
            replacements:values,
            type: QueryTypes.SELECT
        });
        await sequelize.close();
        return data;
    }catch (err: any) {
        console.error(err, query, values);
        throw 'Database query error';
    }
};

export const run_insert = async (sql:any, values:any) => {
    try{
        const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
        await sequelize.authenticate();
        let data = await sequelize.query(sql, {
            replacements:values,
            type: QueryTypes.INSERT
        });
        await sequelize.close();
        return data;
    }catch (err: any) {
        console.error(err, sql, values);
        throw 'Database query error';
    }
};

export const run_update = async (sql:any, values:any) => {
    try{
        const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
        await sequelize.authenticate();
        let data = await sequelize.query(sql, {
            replacements:values,
            type: QueryTypes.UPDATE
        });
        await sequelize.close();
        return data;
    }catch (err: any) {
        console.error(err, sql, values);
        throw 'Database query error';
    }
};

export const run_delete = async (query:any, values:any) => {
    try{
        const sequelize = new Sequelize(`postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
        await sequelize.authenticate();
        let data = await sequelize.query(query, {
            replacements:values,
            type: QueryTypes.DELETE
        });
        await sequelize.close();
        return data;
    }catch (err: any) {
        console.error(err, query, values);
        throw 'Database query error';
    }
};

backend/models/articles.ts
import * as db from '../helpers/database';

export const getAll = async function getAll() {
    // TODO: use page, limit, order to give pagination
    let query = "SELECT * FROM articles;"
    let data = await db.run_query(query, '');
    return data;
}

export const getById = async (id:any) => {
    let query = "SELECT * FROM articles WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}


export const add = async (article:any) => {
    let keys = Object.keys(article);
    let values = Object.values(article);
    let key = keys.join(',');
    let param = '';
    for(let i:number = 0; i<values.length; i++){ param +='?,'};
    param = param.slice(0,-1);
    let query = `INSERT INTO articles (${key}) VALUES (${param})`;
    try{
        await db.run_insert(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
}

export const update = async (id: number, article: any) => {
    let query = "UPDATE articles SET ";
    let values: any = { id: id };
    let setClauses: string[] = [];
    Object.keys(article).forEach((key) => {
        setClauses.push(`${key} = :${key}`);
        values[key] = article[key];
      });
    
    query += setClauses.join(', ') + " WHERE id = :id;";
    
    try{
        await db.run_update(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
}

export const del = async (id: number) => {
    let query = `DELETE FROM articles WHERE id = :id;`;

    let values = {
        id: id
    };

    try{
        await db.run_delete(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
};


backend/models/users.ts
import * as db from '../helpers/database';

export const getAll = async function getAll() {
    // TODO: use page, limit, order to give pagination
    let query = "SELECT * FROM users;"
    let data = await db.run_query(query, '');
    return data;
}

export const getById = async (id:any) => {
    let query = "SELECT * FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

export const add = async (user:any) => {
    let keys = Object.keys(user);
    let values = Object.values(user);
    let key = keys.join(',');
    let param = '';
    for(let i:number = 0; i<values.length; i++){ param +='?,'};
    param = param.slice(0,-1);
    let query = `INSERT INTO users (${key}) VALUES (${param})`;
    try{
        await db.run_insert(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
}

export const update = async (id: number, body: any) => {
    let query = "UPDATE users SET ";
    let values: any = { id: id };
    let setClauses: string[] = [];
    Object.keys(body).forEach((key) => {
        setClauses.push(`${key} = :${key}`);
        values[key] = body[key];
      });
    
    query += setClauses.join(', ') + " WHERE id = :id;";
    
    try{
        await db.run_update(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
}

export const del = async (id: number) => {
    let query = `DELETE FROM users WHERE id = :id;`;

    let values = {
        id: id
    };

    try{
        await db.run_delete(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
};

export const findByUsername = async(username: string) => {
    const query = 'SELECT * from users where username = ?';
    const user = await db.run_query(query, [username]);
    return user;
}

backend/routers/articles.ts
import Router, {RouterContext} from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as model from '../models/articles';
import { basicAuth } from '../controllers/auth';
import { validateArticle } from '../controllers/validation';

const router = new Router({prefix: '/api/v1/articles'});

const getAll = async (ctx:RouterContext, next: any) => {
    let articles = await model.getAll();
    ctx.body = articles;
    await next();
}

const getById = async (ctx:RouterContext, next: any) => {
    let id = +ctx.params.id;
    let article = await model.getById(id);
    if(article.length){
        ctx.body = article[0];
    } else {
        ctx.status = 404;
    }
    await next();
}

const createArticle = async (ctx:RouterContext, next: any) => {
    const body = ctx.request.body;
    let result = await model.add(body);
    if(result.status == 201){
        ctx.status = 201;
        ctx.body = body;
    }else{
        ctx.status = 500;
        ctx.body = {err: "insert data failed"};
    }
    
    await next();
}

const updateArticle = async (ctx:RouterContext, next: any) => {
    let id = +ctx.params.id;
    const body = ctx.request.body;
    let result = await model.update(id,body);
    if(result.status == 201){
        ctx.status = 201;
        ctx.body = body;
    }else{
        ctx.status = 500;
        ctx.body = {err: "update data failed"};
    }
    await next();
}

const deleteArticle = async (ctx:RouterContext, next: any) => {
    let id = +ctx.params.id;
    let result = await model.del(id);
    if(result.status == 201){
        ctx.status = 201;
        ctx.body = {
            message: "Removed article " + id
        };
    }else{
        ctx.status = 500;
        ctx.body = {err: "delete data failed"};
    }
    await next();
}


router.get('/', getAll);
router.get('/:id([0-9]{1,})', basicAuth, getById);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateArticle, updateArticle);
router.delete('/:id([0-9]{1,})', basicAuth, deleteArticle);

export { router };

backend/routers/special.ts
import Router, { RouterContext } from 'koa-router';
import { basicAuth } from '../controllers/auth';

const router = new Router({prefix: '/api/v1'});

router.get('/', async(ctx: RouterContext, next: any)=> {
    ctx.body = {
        msg: 'Public API return'
    };
    await next();
});

router.get('/private', basicAuth);

export { router };

backend/routers/users.ts
import Router, {RouterContext} from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as model from '../models/users';
import { basicAuth } from '../controllers/auth';
import { validateUser } from '../controllers/validation';

const router = new Router({prefix: '/api/v1/users'});

const getAll = async (ctx:RouterContext, next: any) => {
    let users = await model.getAll();
    ctx.body = users;
    await next();
}

const getById = async (ctx:RouterContext, next: any) => {
    let id = +ctx.params.id;
    let user = await model.getById(id);
    if(user.length){
        ctx.body = user[0];
    } else {
        ctx.status = 404;
    }
    await next();
}

const createUser = async (ctx:RouterContext, next: any) => {
    const body = ctx.request.body;
    let result = await model.add(body);
    if(result.status == 201){
        ctx.status = 201;
        ctx.body = body;
    }else{
        ctx.status = 500;
        ctx.body = {err: "insert data failed"};
    }
    
    await next();
}

const updateUser = async (ctx:RouterContext, next: any) => {
    let id = +ctx.params.id;
    const body = ctx.request.body;
    let result = await model.update(id,body);
    if(result.status == 201){
        ctx.status = 201;
        ctx.body = body;
    }else{
        ctx.status = 500;
        ctx.body = {err: "update data failed"};
    }
    await next();
}

const deleteUser = async (ctx:RouterContext, next: any) => {
    let id = +ctx.params.id;
    let result = await model.del(id);
    if(result.status == 201){
        ctx.status = 201;
        ctx.body = {
            message: "Removed user " + id
        };
    }else{
        ctx.status = 500;
        ctx.body = {err: "delete data failed"};
    }
    await next();
}


router.get('/', basicAuth, getAll);
router.get('/:id([0-9]{1,})', basicAuth, getById);
router.post('/', bodyParser(), basicAuth, validateUser, createUser);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateUser, updateUser);
router.delete('/:id([0-9]{1,}), basicAuth', deleteUser);

export { router };

backend/schemas/article.schema.ts
export const article = {
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
        "summary":{
            "description": "Optional short text summary of article",
            "type": "string"
        },
        "imageURL":{
            "description": "URL for main image to show in article",
        },
        "published":{
            "description": "Is the article published or not",
            "type": "boolean"
        },
        "authorID":{
            "description": "User ID of the article author",
            "type": "integer",
            "minimum": 0
        },
    },
    "required": ["title", "allText", "authorID"]
}

backend/schemas/user.schema.ts
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

backend/config.ts
const config = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres", 
    database: "postgres", 
    connection_limit:100
}

export default config;

backend/index.ts
import Koa from "koa";
import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import { router as articles } from "./routers/articles";
import { router as users } from "./routers/users";
import { router as testBA } from "./routers/special";
import serve from 'koa-static';

const app: Koa = new Koa();
const router: Router = new Router();

const welcomeAPI = async (ctx: RouterContext, next: any) => {
    ctx.body = {
        message: "Welcom to the blog API!"
    };
    await next();
};

router.get('/api/v1', welcomeAPI);

app.use(logger());
app.use(json());
app.use(router.routes());
app.use(articles.routes());
app.use(users.routes());
app.use(async (ctx: RouterContext, next: any) => {
    try{
        await next();
        if ( ctx.status === 404 ){
            ctx.status = 404; //if ctx.body is set when the status has not been explicitly defined (through ctx.status), the status is set to 200. 
            ctx.body = { err: "No such endpoint existed", status: ctx.status};
        }
    }catch ( err:any ) {
        ctx.body = { err:err };
    }
})

app.listen(10888);

backend/package.json
{
  "dependencies": {
    "@koa/cors": "^5.0.0",
    "@types/koa": "^2.15.0",
    "@types/koa-bodyparser": "^4.3.12",
    "@types/koa-json": "^2.0.23",
    "@types/koa-logger": "^3.1.5",
    "@types/koa-passport": "^6.0.3",
    "@types/koa-router": "^7.4.8",
    "@types/koa-static": "^4.0.4",
    "@types/passport-http": "^0.3.11",
    "@types/passport-jwt": "^4.0.1",
    "jsonschema": "^1.5.0",
    "koa": "^3.0.0",
    "koa-bodyparser": "^4.4.1",
    "koa-json": "^2.0.2",
    "koa-logger": "^3.2.1",
    "koa-passport": "^6.0.0",
    "koa-req-validation": "^0.17.0",
    "koa-router": "^11.0.2",
    "koa-static": "^5.0.0",
    "passport-http": "^0.3.0",
    "passport-jwt": "^4.0.1",
    "pg": "^8.16.0",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.7",
    "supertest": "^7.1.1"
  }
}


backend/tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",                                  
    "module": "commonjs",                                
    "outDir": "./out/",                                  
    "esModuleInterop": true,                            
    "forceConsistentCasingInFileNames": true,           
    "strict": true,                                     
    "skipLibCheck": true                                
  }
}

postgreSQL
CREATE TABLE public.articles (
	id serial4 NOT NULL,
	title varchar(32) NOT NULL,
	alltext text NOT NULL,
	summary text NULL,
	datecreated timestamp NOT NULL DEFAULT now(),
	datemodified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	imageurl varchar(2048) NULL,
	published bool NULL,
	authorid int4 NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (id)
);


INSERT INTO articles (title, allText, authorID) VALUES
	('title 1', 'some stuff', 1),
	('another title', 'interesting', 1),
	('last one', 'ok', 1),
	('this title is good', 'some text', 3);
---
