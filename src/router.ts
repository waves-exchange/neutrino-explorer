import Router from 'koa-router';
import { getCurrentBalanceM } from './api/getCurrentBalanceM';
import { getTotalStakedM } from './api/getTotalStakedM';
import { getUsdnAPYM } from './api/getUsdnAPYM';
import { USDN_PRECISION } from './constants';
import { getPriceBlocksM } from './api/getPriceBlocksM';
import { getNeutrinoInfoM } from './api/getNeutrinoInfoM';
import { getCirculatingSupplyUSDNM } from './api/getCirculatingSupplyUSDNM';
import { getConstantM } from './api/getConstantM';
import { getHomeM } from './api/getHomeM';
import { getXtnDistributionM } from './api/getXtnDistributionM';
import { getHeathcheckM } from './api/getHeathcheckM';

export const router = new Router();

router
    .get('/', getHomeM)
    .get('/get_current_price', getNeutrinoInfoM('currentPrice'))
    .get('/get_current_nsbt2usdn_price', getNeutrinoInfoM('nsbt2xtnPrice'))
    .get('/get_current_nsbt2xtn_price', getNeutrinoInfoM('nsbt2xtnPrice'))
    .get('/get_br', getNeutrinoInfoM('BR'))
    .get('/get_current_balance', getCurrentBalanceM)
    .get('/get_total_issued', getNeutrinoInfoM('neutrinoTotalSupply'))
    .get('/get_staked', getTotalStakedM)
    .get('/get_annual_yield', getUsdnAPYM)
    .get('/get_circulating_supply', getCirculatingSupplyUSDNM)
    .get('/get_decimals', getConstantM(USDN_PRECISION))
    .get('/get_price_blocks', getPriceBlocksM)
    .get('/get_xtn_distribution/limit/:limit/offset/:offset', getXtnDistributionM)
    .get('/heathcheck', getHeathcheckM);


console.log('Router ready.');