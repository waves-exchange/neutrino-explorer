import { Middleware } from 'koa';
import { XtnDistributionCollection, XtnDistributionUpdateProgress } from '../services/xtnDistribution';
import { BadRequest, InternalError } from '../errors';


export const getXtnDistributionM: Middleware = (ctx, next) => {
    const { limit, offset } = ctx.params;
    const direction: 'asc' | 'desc' = ctx.query?.direction as any ?? 'desc';

    if (limit > 1000 || limit <= 0 || !limit || isNaN(Number(limit))) {
        throw new BadRequest('Wrong limit! Limit must be > 0 and limit <= 1000');
    }

    if (offset < 0 || isNaN(Number(offset))) {
        throw new BadRequest('Wrong offset! Offset must be >= 0.');
    }

    if (!['asc', 'desc'].includes(direction)) {
        throw new BadRequest('Wrong direction! Direction must be "asc" or "desc"! Default is "desc"');
    }

    if (XtnDistributionCollection.length === 0) {
        throw new InternalError('Service is not ready', `Server start progress is ${XtnDistributionUpdateProgress}`);
    }

    const tmp = XtnDistributionCollection.slice();

    if (direction === 'asc') {
        tmp.reverse();
    }

    const list = tmp.slice(offset, Number(offset) + Number(limit));

    ctx.body = {
        hasNext: tmp.length > Number(offset) + Number(limit),
        list,
    };

    return next();
};


