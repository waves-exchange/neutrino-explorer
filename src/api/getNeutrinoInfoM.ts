import { PromiseEntry } from '../types';
import { Middleware } from 'koa';
import { pipe, prop } from 'ramda';
import { getNeutrinoState } from './utils/getNeutrinoState';

export const getNeutrinoInfoM = <K extends keyof PromiseEntry<ReturnType<typeof getNeutrinoState>>>(key: K): Middleware =>
    (ctx, next) =>
        getNeutrinoState()
            .then(pipe(prop(key), String))
            .then(res => {
                ctx.body = res;
                return next();
            });