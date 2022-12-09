import Koa from 'koa';
import { applyErrorM } from './errors';
import { router } from './router';
import { PORT } from './constants';

const app = new Koa();

app
    .use(applyErrorM)
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(PORT);

console.log(`Listen port: ${PORT}.`);

