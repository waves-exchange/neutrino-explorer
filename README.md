# neutrino-explorer
Neutrino Public API and Analytics

*API endpoint is hosted at https://beta.neutrino.at/api/explorer*

Method ```get_current_price``` (https://beta.neutrino.at/api/explorer/get_current_price) returns current Waves/USD price on the smart contract (2 decimal precision).

Method ```get_current_balance``` (https://beta.neutrino.at/api/explorer/get_current_balance) returns current total balance of the Neutrino main smart contract.

Method ```get_total_issued``` (https://beta.neutrino.at/api/explorer/get_total_issued) returns total issued USD-Ns.

Method ```get_staked``` (https://beta.neutrino.at/api/explorer/get_staked) returns total Neutrinos in staking.

Method ```get_annual_yield``` (https://beta.neutrino.at/api/explorer/get_annual_yield) returns expected annual staking ROI.

Method ```get_circulating_supply``` (https://beta.neutrino.at/api/explorer/get_circulating_supply) returns Neutrinos circulating supply.

Method ```get_decimals``` (https://beta.neutrino.at/api/explorer/get_decimals) returns USD-N decimals.

Method ```get_circulating_supply_no_dec``` (https://beta.neutrino.at/api/explorer/get_circulating_supply_no_dec) returns Neutrinos circulating supply with no decimals.

Method ```get_deficit``` (https://beta.neutrino.at/api/explorer/get_deficit) returns deficit (when positive) and surplus (when negative) on the Neutrino smart contract.

Method ```get_price_blocks?start=<block_height>&end=<block_height>``` (https://beta.neutrino.at/api/explorer/get_price_blocks?start=1853530&end=1853556) returns JSON that shows blocks where the price was finalized.

Method ```get_locked_for_swap``` (https://beta.neutrino.at/api/explorer/get_locked_for_swap) returns USDNs locked on the Neutrino smart contract.

Method ```get_deficit_per_cent``` (https://beta.neutrino.at/api/explorer/get_deficit_per_cent) returns deficit in percent.

Method ```get_total_bonds_rest``` (https://beta.neutrino.at/api/explorer/get_total_bonds_rest) returns bonds left to be bought.

Method ```get_total_liquidation``` (https://beta.neutrino.at/api/explorer/get_total_liquidation) returns bonds left to be liquidated.


## Example
### Getting current price

```
GET /api/get_current_price
```

**Response:**
```
0.59
```

## Deployment
Simply run ```deploy.sh``` as root to build and launch the Docker container.
