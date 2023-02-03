const getRequiredEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Has no value for ${name} in env!`);
    }
    return value;
};

export const PORT = process.env.PORT ?? 8080;

export const NEUTRINO_CONTRACT = getRequiredEnv('NEUTRINO_CONTRACT');
export const NODE_URL = getRequiredEnv('NODE_URL');
export const NEUTRINO_REST = getRequiredEnv('NEUTRINO_REST_CONTRACT_ADDRESS');
export const XTN_STAKING_DAPP = getRequiredEnv('XTN_STAKING_DAPP');
export const NEUTRINO_REST_V2 = getRequiredEnv('NEUTRINO_REST_V2');
export const CONTROL_CONTRACT = getRequiredEnv('CONTROL_CONTRACT');
export const LIQUIDATION_CONTRACT = getRequiredEnv('LIQUIDATION_CONTRACT');

export const XTN_ASST_ID = getRequiredEnv('XTN_ASSET_ID');
export const WAVES_PRECISION = 8;
export const USDN_PRECISION = 6;