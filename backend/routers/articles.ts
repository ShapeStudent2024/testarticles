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

/*testing data for function validateArticle: 
{
    "title": "lab07-b",
    "allText": "lab07-b",
}
{
    "title": "lab07-b",
    "allText": "lab07-b",
    "authorID": "1"
}
{
    "title": "lab07-b",
    "allText": "lab07-b",
    "authorID": 1
}
*/

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