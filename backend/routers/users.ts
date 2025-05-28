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
/*
testing
{
    "username": "Jackson",
    "email": "jack@gmail.com"
}
*/
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