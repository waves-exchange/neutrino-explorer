import { Middleware } from 'koa';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';

export const getHomeM: Middleware = (ctx, next) => {
    return readFile(join(__dirname, '..', '..', 'README.md'), 'utf8')
        .then(md => {
            ctx.body = marked(md);
            return next();
        });
};