import axios from 'axios';
import { prop } from 'ramda';
import { NODE_URL } from '../../constants';

export const evaluate = <Result extends EvaluateResult<any>>(
    contract: string,
    expression: string
): Promise<Result> =>
    axios.post<Result>(`${NODE_URL}utils/script/evaluate/${contract}`, { expr: expression })
        .then<EvaluateErrorResult | Result>(prop('data'))
        .then<Result>((data) => {
            if (!data || 'error' in data) {
                return Promise.reject(data);
            }
            return data;
        })
        .catch((error) => {
            console.error(`evaluate. Msg: ${error.message}; Expression: ${expression}`);
            return Promise.reject({ error: error.message, expression });
        });

export type NodeValueGeneric<Type extends string, Value> = {
    type: Type;
    value: Value;
};

export type EvaluateEntry<Content extends EvaluateDataType, Key extends string = string> = {
    type: string;
    value: {
        key: EvaluateStringDataType<Key>;
        value: Content;
    };
};

export type EvaluateIntDataType<LONG = string> = NodeValueGeneric<'Int', LONG>;
export type EvaluateBigIntDataType<LONG = string> = NodeValueGeneric<'BigInt', LONG>;
export type EvaluateByteVectorDataType = NodeValueGeneric<'ByteVector', string>;
export type EvaluateStringDataType<Key extends string = string> = NodeValueGeneric<'String', Key>;
export type EvaluateBooleanDataType = NodeValueGeneric<'Boolean', boolean>;
export type EvaluateUnitDataType = NodeValueGeneric<'Unit', {}>;
export type EvaluateArrayDataType<
    Content extends Array<EvaluateDataType>,
    LONG = string
    > = NodeValueGeneric<'Array', Content>;
export type EvaluateTupleDataType<
    Content extends Record<string, EvaluateDataType<any> | EvaluateEntry<any>>
    > = NodeValueGeneric<'Tuple', Content>;

export type EvaluateDataType<LONG = string> =
    | EvaluateIntDataType<LONG>
    | EvaluateBigIntDataType<LONG>
    | EvaluateStringDataType
    | EvaluateBooleanDataType
    | EvaluateUnitDataType
    | EvaluateArrayDataType<any, LONG>
    | EvaluateTupleDataType<any>
    | EvaluateByteVectorDataType;

export type EvaluateResult<Content extends EvaluateEntry<any> | EvaluateDataType<any>> =
    EvaluateSuccessResult<Content>;

export type EvaluateSuccessResult<Content extends EvaluateEntry<any> | EvaluateDataType<any>> = {
    address: string;
    expr: string;
    result: Content;
};

export type EvaluateErrorResult = {
    address: string;
    expr: string;
    error: number;
    message: string;
};