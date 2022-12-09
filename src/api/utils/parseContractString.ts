import { BigNumber } from '@waves/bignumber';
import { identity, isNil } from 'ramda';

type Func<Args extends Array<any>, Return> = (...args: Args) => Return;

type NeutrinoTypeLabel = 'long' | 'string' | 'boolean' | 'number';

type LabelMap = {
    long: BigNumber;
    number: number;
    boolean: boolean;
    string: string;
};

type ResponseBySchema<T extends ParseNeutrinoTuple<any>> = {
    [Key in T[0]]: T extends [Key, any]
        ? LabelMap[Extract<T, [Key, any]>[1]]
        : T extends [Key, 'number' | 'long', number]
            ? LabelMap[Extract<T, [Key, any, any]>[1]]
            : T extends [Key, 'string', Func<[string], infer R>]
                ? R
                : never;
};

type ParseNeutrinoTuple<K extends string> =
    | [K, NeutrinoTypeLabel]
    | [K, 'long' | 'number', number, boolean?]
    | [K, 'string', (data: string) => any]
    | [];

export const parseContractString =
    <K extends string, T extends ParseNeutrinoTuple<K>>(schema: Array<T>) =>
        (contractString: string): ResponseBySchema<T> => {
            const withoutPrefix = contractString.replace(/(%\w)+__/g, '').split('__');
            return schema.reduce((acc, [key, label, options, optional = false], index) => {
                if (!key) {
                    return acc;
                }

                const factor = typeof options === 'number' ? options : 0;
                const processor = typeof options === 'function' ? options : identity;
                const merge = (value: any) => Object.assign(acc, { [key]: value });
                const rawValue = withoutPrefix[index];

                if (isNil(rawValue)) {
                    if (!optional) {
                        const msg = `Has no value for index ${index}! Prop name: ${key}, label: ${label}, options: ${options}`;
                        console.error(msg);
                        throw new Error(msg);
                    } else {
                        return acc;
                    }
                }

                switch (label) {
                    case 'long':
                        return merge(new BigNumber(rawValue).div(10 ** factor));
                    case 'boolean':
                        return merge(rawValue === 'true');
                    case 'number':
                        return merge(Number(rawValue) / 100 ** factor);
                    case 'string':
                        return merge(processor(rawValue));
                    default:
                        throw new Error('Unsupported label!');
                }
            }, Object.create(null));
        };