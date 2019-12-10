const express = require('express');

let app = express();
const port = process.env.PORT || 8000;

const explorerApi = require('./api/ExplorerApi.ts');
const neutrinoContractAddress = "3PC9BfRwJWWiw9AREE2B3eWzCks3CYtg4yo";
const nodeUrl = "http://nodes.wavesnodes.com/";

// Helper Functions
async function connectExplorerApi(nodeUrl, neutrinoContractAddress){
  try {
    return await explorerApi.ExplorerApi.create(nodeUrl, neutrinoContractAddress);
  } catch(error){
    console.log(error);
  }
}

let explorerApiObject;
(async function (){
  explorerApiObject = await connectExplorerApi(nodeUrl, neutrinoContractAddress);
})();


// -------------------
app.get('/api/get_current_price', async (req, res) => {
  try {
    let price = await explorerApiObject.getPrice();

    res.status(200).send(price.toString());
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/get_current_balance', async (req, res) => {
  try {
    let balance = await explorerApiObject.getBalance();

    res.status(200).send(balance.toString());
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/get_total_issued', async (req, res) => {
  try {
    let total_issued = await explorerApiObject.getTotalIssued();

    res.status(200).send(total_issued.toString());
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/get_staked', async (req, res) => {
  try {
    let staked = await explorerApiObject.getStaked();

    res.status(200).send(staked.toString());
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/get_annual_yield', async (req, res) => {
  try {
    let annualYield = await explorerApiObject.getAnnualYield();

    res.status(200).send(annualYield.toString());
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/get_circulating_supply', async (req, res) => {
  try {
    let circulatingSupply = await explorerApiObject.getCirculatingSupply();

    res.status(200).send(circulatingSupply.toString());
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

// app.get('/api/get_deficit', async (req, res) => {
//   try {
//     let deficit = await explorerApiObject.getDeficit();
//
//     res.status(200).send(deficit.toString());
//   }
//   catch(error){
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

app.get('/api/get_decimals', async (req, res) => {
  try {
    let decimals = await explorerApiObject.getDecimals();

    res.status(200).send(decimals.toString());
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});



//Listener
let server = app.listen(port, function () {
     console.log("Running express-api on port " + port);
});
