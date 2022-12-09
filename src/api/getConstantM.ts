import { Middleware } from 'koa';

export const getConstantM: (constant: string | number) => Middleware =
    (constant: string | number) => (ctx, next) => {
        ctx.body = constant;
        return next();
    };