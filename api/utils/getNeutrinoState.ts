import {
    evaluate,
    EvaluateArrayDataType,
    EvaluateResult,
    EvaluateStringDataType,
    EvaluateTupleDataType
} from './evaluate';
import { parseNeutrinoState } from './parseNeutrinoState';

export const getNeutrinoState = () => evaluate<NeutrinoRestEvaluateResponse>(process.env.NEUTRINO_REST_CONTRACT_ADDRESS, 'neutrinoStatsREADONLY()')
    .then((r) => parseNeutrinoState(r.result.value._2.value));

export type NeutrinoRestEvaluateResponse = EvaluateResult<
    EvaluateTupleDataType<{
        _1: EvaluateArrayDataType<[]>;
        _2: EvaluateStringDataType;
    }>
>;