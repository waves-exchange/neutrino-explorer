import {
    evaluate,
    EvaluateArrayDataType,
    EvaluateResult,
    EvaluateStringDataType,
    EvaluateTupleDataType
} from './evaluate';
import { NEUTRINO_REST_V2 } from '../../constants';
import { pipe, prop } from 'ramda';
import { parseContractString } from './parseContractString';
import { cache } from './cache';
import { BigNumber } from '@waves/bignumber';

export const getAPY = cache(
    3000,
    () => evaluate<NeutrinoRestEvaluateResponse>(NEUTRINO_REST_V2, 'usdnStakingAprREADONLY(14)')
        .then(pipe(prop('result'), prop('value'), prop('_2'), prop('value')))
        .then<{ apr: BigNumber }>(parseContractString([['apr', 'long', 4]]))
);

export type NeutrinoRestEvaluateResponse = EvaluateResult<EvaluateTupleDataType<{
    _1: EvaluateArrayDataType<[]>;
    _2: EvaluateStringDataType;
}>>;