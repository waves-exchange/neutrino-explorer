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

## Example
### Getting current price

```
GET /api/get_current_price
```

**Response:**
```
0.59
```
