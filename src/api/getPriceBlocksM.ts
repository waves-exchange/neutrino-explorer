import { Middleware } from 'koa';
import { BadRequest } from '../errors';
import { ParsedUrlQuery } from 'querystring';
import { flatten, indexBy, prop, range, splitEvery } from 'ramda';
import axios from 'axios';
import { CONTROL_CONTRACT, NODE_URL } from '../constants';
import { IDataEntry } from '@waves/waves-transactions';

const parseQuery = (query: ParsedUrlQuery): { start: number; end: number } => {
    const start = Number(query['start']);
    const end = Number(query['end']);

    if (!start || !end) {
        throw new BadRequest('Query is invalid. Check start and end parameters.');
    }
    return { start, end };
};

const getKey = (block: number) => `price_${block}`;

export const getPriceBlocksM: Middleware = (ctx, next) => {
    const { start, end } = parseQuery(ctx.query);
    const dataKeys = splitEvery(100, range(start, end + 1).map(getKey));

    return Promise
        .all(dataKeys.map((keys) =>
                axios.post(`${NODE_URL}addresses/data/${CONTROL_CONTRACT}`, { keys }, {
                    headers: { 'Content-Type': 'application/json' }
                }).then<Array<IDataEntry>>(prop('data'))
            )
        )
        .then(flatten)
        .then((dataEntryList) => {
            const hash = indexBy(prop('key'), dataEntryList);

            const result = range(start, end + 1).map((block) => {
                const key = getKey(block);
                return { [block]: hash[key] ? hash[key].value : null };
            });

            ctx.body = result;

            return next();
        });
};