# Neutrino Explorer
Neutrino Public API and Analytics

*API endpoint is hosted at https://neutrino.at/api/explorer*

Method ```get_current_price``` (https://neutrino.at/api/explorer/get_current_price) returns current Waves/USD price on the smart contract (6 decimal precision).

@deprecated
Method ```get_current_nsbt2usdn_price``` (https://neutrino.at/api/explorer/get_current_nsbt2usdn_price) returns current NSBT/USDN price on the smart contract (6 decimal precision).

Method ```get_current_nsbt2xtn_price``` (https://neutrino.at/api/explorer/get_current_nsbt2xtn_price) returns current NSBT/USDN price on the smart contract (6 decimal precision).

Method ```get_br``` (https://neutrino.at/api/explorer/get_br) returns current baking ratio (BR).

Method ```get_current_balance``` (https://neutrino.at/api/explorer/get_current_balance) returns current total balance of the Neutrino main smart contract.

Method ```get_total_issued``` (https://neutrino.at/api/explorer/get_total_issued) returns total issued USD-Ns.

Method ```get_staked``` (https://neutrino.at/api/explorer/get_staked) returns total Neutrinos in staking.

Method ```get_annual_yield``` (https://neutrino.at/api/explorer/get_annual_yield) returns expected annual staking ROI based on averaging 14 recent rewards.

Method ```get_circulating_supply``` (https://neutrino.at/api/explorer/get_circulating_supply) returns Neutrinos circulating supply.

Method ```get_decimals``` (https://neutrino.at/api/explorer/get_decimals) returns USD-N decimals.

Method ```get_price_blocks?start=<block_height>&end=<block_height>``` (https://neutrino.at/api/explorer/get_price_blocks?start=1853530&end=1853556) returns JSON that shows blocks where the price was finalized.

Method ```get_xtn_distribution/limit/<limit>/offset/<offset>?direction=<asc|desc>``` (https://neutrino.at/api/explorer/get_xtn_distribution/limit/100/offset/0) returns JSON with address and balance of XNT token.
Limit must be in range from 1 to 1000, offset must be greater or equal to 0. Query param direction must be one of "asc" or "desc". "desc" is default value. 
