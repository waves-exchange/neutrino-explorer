import { cache } from './cache';
import axios from 'axios';
import { NODE_URL } from '../../constants';
import { prop } from 'ramda';

export const getHeight = cache(
    1000,
    (): Promise<number> => axios.get(`${NODE_URL}blocks/height`)
        .then<{ height: number }>(prop('data'))
        .then(prop('height'))
);
