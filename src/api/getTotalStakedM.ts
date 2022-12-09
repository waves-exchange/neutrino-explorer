import { Middleware } from 'koa';
import { getTotalStakedUsdn } from './utils/getTotalStakedUsdn';
import { BigNumber } from '@waves/bignumber';
import { USDN_PRECISION } from '../constants';

export const getTotalStakedM: Middleware = (ctx, next) =>
    getTotalStakedUsdn()
        .then(({ value }) => {
            ctx.body = String(new BigNumber(value as string).div(10 ** USDN_PRECISION));
            return next();
        });
