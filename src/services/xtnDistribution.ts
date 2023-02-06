import axios from 'axios';
import { LIQUIDATION_CONTRACT, NEUTRINO_CONTRACT, NODE_URL, XTN_ASST_ID } from '../constants';
import { add, prop } from 'ramda';
import { getHeight } from '../api/utils/getHeight';
import { getNeutrinoState } from '../api/utils/getNeutrinoState';
import { BigNumber } from '@waves/bignumber';

export type DistributionItem = {
    address: string;
    balance: number;
}

export let XtnDistributionCollection: Array<DistributionItem> = [];
export let XtnDistributionUpdateProgress = '0';

const getXtnDistribution = (height: number, totalSupply: BigNumber, isFirstLaunch: boolean): Promise<Array<DistributionItem>> =>
    new Promise((resolve) => {
        const result: Record<string, number> = Object.create(null);
        const requestCount = isFirstLaunch ? 500 : 100;

        const loop = (after: string) => {
            const afterUrl = after ? `?after=${after}` : '';
            axios.get(`${NODE_URL}assets/${XTN_ASST_ID}/distribution/${height - 1}/limit/${requestCount}${afterUrl}`)
                .then<API.Response>(prop('data'))
                .then(({ hasNext, items, lastItem }) => {

                    delete items[NEUTRINO_CONTRACT];
                    delete items[LIQUIDATION_CONTRACT];

                    Object.assign(result, items);

                    const sum = Object.values(result)
                        .reduce(add, 0);

                    XtnDistributionUpdateProgress = new BigNumber(sum)
                        .div(10 ** 6)
                        .div(totalSupply)
                        .mul(100)
                        .roundTo(2)
                        .toFormat();

                    console.log(`Update distribution progress is: ${XtnDistributionUpdateProgress}%`);

                    if (hasNext) {
                        if (isFirstLaunch) {
                            loop(lastItem);
                        } else {
                            setTimeout(() => loop(lastItem), 1000);
                        }
                    } else {
                        const balances = Object.entries(result)
                            .map(([address, balance]) =>
                                Object.assign(
                                    Object.create(null), {
                                        address,
                                        balance: balance / 10 ** 6
                                    })
                            )
                            .sort((b, a) => a.balance - b.balance);
                        resolve(balances);
                    }
                })
                .catch((e) => {
                    console.log(`Fail to fetch distribution part after ${after}. Try again after 5s.`);
                    console.log(e.m);
                    setTimeout(() => loop(after), 5000);
                });
        };

        loop('');
    });

const updateCache = () => {
    Promise.all([
        getHeight(),
        getNeutrinoState()
    ])
        .then(([height, { neutrinoTotalSupply }]) =>
            getXtnDistribution(height, neutrinoTotalSupply, XtnDistributionCollection.length === 0))
        .then(list => {
            XtnDistributionCollection = list;
            XtnDistributionUpdateProgress = '0';
            setTimeout(updateCache, 1000 * 60 * 60 * 4);
        })
        .catch(() => {
            console.log(`Update distribution cache error! Try agan after 10s.`);
            setTimeout(updateCache, 10_000);
        });
};

updateCache();

namespace API {
    export type Response = {
        hasNext: boolean;
        lastItem: string;
        items: Record<string, number>
    }
}