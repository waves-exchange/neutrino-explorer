# neutrino-explorer
Neutrino Public API and Analytics

*API endpoint is hosted at beta.neutrino.at/api/*

Method ```get_current_price``` returns current Waves/USD price on the smart contract (2 decimal precision).

Method ```get_current_balance``` returns current total balance of the Neutrino main smart contract.

Method ```get_total_issued``` returns total issued USD-Ns. 

Method ```get_staked returns``` total Neutrinos in staking. 

Method ```get_annual_yield``` returns expected annual staking ROI. 

Method ```get_circulating_supply``` returns Neutrinos circulating supply.

## Example
### Getting current price

```
GET /api/get_current_price
```

**Response:**
```
0.59
```

