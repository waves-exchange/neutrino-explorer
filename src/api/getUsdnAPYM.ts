import { Middleware } from 'koa';
import { getAPY } from './utils/getAPY';

export const getUsdnAPYM: Middleware = (ctx, next) =>
    getAPY()
        .then(({ apr }) => {
            ctx.body = String(apr);
            return next();
        });