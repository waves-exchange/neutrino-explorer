import { Middleware } from 'koa';
import { fetchBalance } from '@waves/node-api-js/cjs/api-node/addresses';
import { NEUTRINO_CONTRACT, NODE_URL, WAVES_PRECISION } from '../constants';
import { BigNumber } from '@waves/bignumber';
import { cache } from './utils/cache';

const fetchBalanceWithCache = cache(3000, () => fetchBalance(NODE_URL, NEUTRINO_CONTRACT));

export const getCurrentBalanceM: Middleware = (ctx, next) =>
    fetchBalanceWithCache()
        .then((data) => new BigNumber(data.balance).div(10 ** WAVES_PRECISION))
        .then((balance) => {
            ctx.body = balance.toFixed();
            return next();
        });
