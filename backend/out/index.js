"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_json_1 = __importDefault(require("koa-json"));
const articles_1 = require("./routers/articles");
const users_1 = require("./routers/users");
const koa_static_1 = __importDefault(require("koa-static"));
const app = new koa_1.default();
const router = new koa_router_1.default();
const welcomeAPI = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = {
        message: "Welcom to the blog API!"
    };
    yield next();
});
router.get('/api/v1', welcomeAPI);
app.use((0, koa_logger_1.default)());
app.use((0, koa_json_1.default)());
app.use(router.routes());
app.use(articles_1.router.routes());
app.use(users_1.router.routes());
app.use((0, koa_static_1.default)('./docs'));
// app.use(testBA.routes()); //Overwrite /api/v1 here
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
        if (ctx.status === 404) {
            ctx.status = 404; //if ctx.body is set when the status has not been explicitly defined (through ctx.status), the status is set to 200. 
            ctx.body = { err: "No such endpoint existed", status: ctx.status };
        }
    }
    catch (err) {
        ctx.body = { err: err };
    }
}));
app.listen(10888);
