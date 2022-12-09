import { parseContractString } from './parseContractString';

export const parseNeutrinoState = parseContractString([
    ['currentPrice', 'long', 6],
    ['neutrinoLockedBalance', 'long', 6],
    ['wavesLockedBalance', 'long', 8],
    ['reservesInWaves', 'long', 8],
    ['reservesInUsdn', 'long', 6],
    ['neutrinoCirculatingSupply', 'long', 6],
    ['neutrinoOutOfMarket', 'long', 6],
    ['neutrinoTotalSupply', 'long', 6],
    ['BR', 'long', 6],
    ['nsbtSupply', 'long', 6],
    ['maxNsbtSupply', 'long', 6],
    ['nsbt2usdnPrice', 'long', 6],
    ['nsbt2wavesPrice', 'long', 6],
    ['minWaves4NsbtBuy', 'long', 8],
    ['minNsbtSell', 'long', 6],
    ['minNsbtLockAmt', 'long', 6],
]);