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
app.use(serve('./docs')); 
// app.use(testBA.routes()); //Overwrite /api/v1 here
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