import { Middleware } from 'koa';
import { getNeutrinoState } from './utils/getNeutrinoState';

export const getCirculatingSupplyUSDNM: Middleware = (ctx, next) =>
    getNeutrinoState()
        .then(({ neutrinoTotalSupply, neutrinoOutOfMarket }) => neutrinoTotalSupply.sub(neutrinoOutOfMarket))
        .then((circular) => {
            ctx.body = String(circular);
            return next();
        });