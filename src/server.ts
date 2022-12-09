import Koa from 'koa';
import mount from 'koa-mount';
import { applyErrorM } from './errors';
import { home, router } from './router';
import { PORT } from './constants';

const app = new Koa();
const api = new Koa();

api
    .use(applyErrorM)
    .use(router.routes())
    .use(router.allowedMethods());

app
    .use(home.routes())
    .use(home.allowedMethods())
    .use(mount('/api/explorer', api))
    .listen(PORT);

console.log(`Listen port: ${PORT}.`);

