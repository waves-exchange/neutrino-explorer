import {
    evaluate,
    EvaluateArrayDataType,
    EvaluateResult,
    EvaluateStringDataType,
    EvaluateTupleDataType
} from './evaluate';
import { parseNeutrinoState } from './parseNeutrinoState';
import { NEUTRINO_REST } from '../../constants';
import { cache } from './cache';

const getState = () => evaluate<NeutrinoRestEvaluateResponse>(NEUTRINO_REST, 'neutrinoStatsREADONLY()')
    .then((r) => parseNeutrinoState(r.result.value._2.value));

export const getNeutrinoState = cache(4000, getState);

export type NeutrinoRestEvaluateResponse = EvaluateResult<
    EvaluateTupleDataType<{
        _1: EvaluateArrayDataType<[]>;
        _2: EvaluateStringDataType;
    }>
>;