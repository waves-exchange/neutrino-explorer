import { Middleware } from 'koa';
import { XtnDistributionCollection, XtnDistributionUpdateProgress } from '../services/xtnDistribution';
import { BadRequest } from '../errors';

export const getHeathcheckM: Middleware = (ctx, next) => {
    if (XtnDistributionCollection.length === 0) {
        throw new BadRequest(`Server is not ready! Progress is ${XtnDistributionUpdateProgress}%`);
    }
    ctx.body = { ok: true };

    return next();
};