import { cache } from './cache';
import { fetchDataKey } from '@waves/node-api-js/cjs/api-node/addresses';
import { NODE_URL, USDN_STAKING_DAPP } from '../../constants';

export const getTotalStakedUsdn = cache(
    3000,
    () => fetchDataKey(NODE_URL, USDN_STAKING_DAPP, '%s%s__stats__activeTotalLocked')
);