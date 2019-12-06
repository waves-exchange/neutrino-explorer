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
    res.send("N/A");
  }
});

app.get('/api/get_current_balance', async (req, res) => {
  try {
    let balance = await explorerApiObject.getBalance();

    res.status(200).send(balance.toString());
  }
  catch(error){
    console.log(error);
    res.send("N/A");
  }
});

app.get('/api/get_total_issued', async (req, res) => {
  try {
    let total_issued = await explorerApiObject.getTotalIssued();

    res.status(200).send(total_issued.toString());
  }
  catch(error){
    console.log(error);
    res.send("N/A");
  }
});

//Tests get requests
app.get('/api/test_connection', async (req, res) => {
  try {
    res.send("Express is online!");
  }
  catch(error){
    res.send(error);
  }
});


//Listener
let server = app.listen(port, function () {
     console.log("Running express-api on port " + port);
});
