import axios from 'axios';
import { nodeInteraction } from "@waves/waves-transactions";
import { accountData, accountDataByKey, currentHeight } from "@waves/waves-transactions/dist/nodeInteraction";

import { NeutrinoContractKeys } from "./contractKeys/NeutrinoContractKeys";
import { ControlContractKeys } from "./contractKeys/ControlContractKeys";
import { RpdContractKeys } from "./contractKeys/RpdContractKeys";
import { AuctionContractKeys } from "./contractKeys/AuctionContractKeys";
import { OrderKeys } from "./contractKeys/OrderKeys";


export class ExplorerApi {
    static readonly WAVELET: number = (10 ** 8);
    neutrinoContractAddress: string;
    auctionContractAddress: string;
    controlContractAddress: string;
    rpdContractAddress: string;
    nodeUrl: string;
    neutrinoAssetId: string;
    bondAssetId: string;
    liquidationContractAddress: string;

    public static async create(nodeUrl: string, neutrinoContractAddress: string){
        const accountDataState = await nodeInteraction.accountData(neutrinoContractAddress, nodeUrl);

        const auctionContractAddress = <string>accountDataState[NeutrinoContractKeys.AuctionContractAddressKey].value
        const controlContractAddress = <string>accountDataState[NeutrinoContractKeys.ControlContractAddressKey].value
        const liquidationContractAddress = <string>accountDataState[NeutrinoContractKeys.LiquidationContractAddressKey].value
        const rpdContractAddress = <string>accountDataState[NeutrinoContractKeys.RpdContractAddressKey].value


        const neutrinoAssetId = <string>accountDataState[NeutrinoContractKeys.NeutrinoAssetIdKey].value
        const bondAssetId = "6nSpVyNH7yM69eg446wrQR94ipbbcmZMU1ENPwanC97g"


        const stakedBalanceKey = <string>accountDataState[RpdContractKeys.BalanceKey].value
        const neutrinoLockedBalanceKey = <string>accountDataState[AuctionContractKeys.WavesLockedBalanceKey].value

        return new ExplorerApi(nodeUrl, neutrinoContractAddress, auctionContractAddress, controlContractAddress, liquidationContractAddress, rpdContractAddress, neutrinoAssetId, bondAssetId)
    }

    public constructor(nodeUrl: string, neutrinoContractAddress: string, auctionContractAddress: string, controlContractAddress: string, liquidationContractAddress: string, rpdContractAddress: string, neutrinoAssetId: string, bondAssetId: string){
        this.neutrinoContractAddress = neutrinoContractAddress;
        this.auctionContractAddress = auctionContractAddress;
        this.controlContractAddress = controlContractAddress;
        this.liquidationContractAddress = liquidationContractAddress;
        this.rpdContractAddress = rpdContractAddress;

        this.neutrinoAssetId = neutrinoAssetId;
        this.bondAssetId = bondAssetId;
        this.nodeUrl = nodeUrl;
    }

    //Helpers
    private async getAssetQuantity(){
      const assetObject = await axios.get(this.nodeUrl+'assets/details/'+this.neutrinoAssetId);
      const assetQuantity = assetObject.data.quantity;

      return <number>(assetQuantity);
    }

    private async getNeutrinoBalance(contractAddress){
      const assetBalance = await nodeInteraction.assetBalance(this.neutrinoAssetId, contractAddress, this.nodeUrl);
      return <number>(assetBalance);
    }

    private async getNeutrinoLockedBalance():Promise<number>{
      return <number>(await nodeInteraction.accountDataByKey(AuctionContractKeys.WavesLockedBalanceKey, this.neutrinoContractAddress, this.nodeUrl)).value/100;
    }

    private getSmartContractAddresses(){
      console.log(this.neutrinoContractAddress,this.auctionContractAddress,this.controlContractAddress,this.liquidationContractAddress,this.rpdContractAddress);
    }

    //Public API methods
    public async getPrice():Promise<any> {
      return <number>(await nodeInteraction.accountDataByKey(ControlContractKeys.PriceKey, this.controlContractAddress, this.nodeUrl)).value/100;
    }

    public async getPriceBlocks(start, end):Promise<any>{

      let startBlock = start;
      let endBlock = end;
      let prefix = "price_";

      let returnArray = [];

      for (let i = startBlock; i <= endBlock; i++) {
        let key = prefix+i;
        let priceObject = (await nodeInteraction.accountDataByKey(key,this.controlContractAddress,this.nodeUrl));

        try{
          let objKey = String(i);
          if (priceObject == null) {
            returnArray.push({[objKey]:null});
          } else {
            returnArray.push({[objKey]:priceObject.value});
          }
        } catch(e){
          console.log(e);
        }
      }
      return returnArray;
    }

    public async getBalance():Promise<number> {
      return <number>(await nodeInteraction.balance(this.neutrinoContractAddress, this.nodeUrl)/ExplorerApi.WAVELET);
    }

    public async getTotalIssued():Promise<number>{

      const assetQuantity = await this.getAssetQuantity();
      const assetDecimals = await this.getDecimals();

      const neutrinoBalance = await this.getNeutrinoBalance(this.neutrinoContractAddress)/(10**assetDecimals);
      const liquidationBalance = await this.getNeutrinoBalance(this.liquidationContractAddress)/(10**assetDecimals);
      const balanceLockNeutrino = Number((await nodeInteraction.accountDataByKey("balance_lock_neutrino", this.neutrinoContractAddress, this.nodeUrl)).value)/(10**assetDecimals);

      return <number>(10**12-neutrinoBalance-liquidationBalance+Number(balanceLockNeutrino));
    }

    public async getStaked():Promise<number>{
      return <number>(await nodeInteraction.accountDataByKey(RpdContractKeys.BalanceKey+"_"+this.neutrinoAssetId, this.rpdContractAddress, this.nodeUrl)).value/10**await this.getDecimals();
    }

    public async getAnnualYieldAnalytical():Promise<number>{
      const monetaryConstant = 6.85;
      const leasingShare = 0.9;
      const nodePerfLagCoefficient = 0.99;
      const stakingShare = await this.getStaked()/await this.getTotalIssued();
      const deficitPerCent = await this.getDeficitPerCent();
      let deficitCoefficient = 1+(deficitPerCent*0.01);

      return <number>(deficitCoefficient*nodePerfLagCoefficient*leasingShare*monetaryConstant/stakingShare);
    }

    public async getAnnualYield():Promise<number>{
      let averageDays = 14;
      const stakingAddress = "3P5X7AFNSTjcVoYLXkgRNTqmp51QcWAVESX";
      const txObject = await axios.get(this.nodeUrl+'transactions/address/'+stakingAddress+'/limit/99');
      const txData = txObject.data[0];

      const filteredTxData = txData.filter(item => String(item.sender) === String('3PLosK1gb6GpN5vV7ZyiCdwRWizpy2H31KR')).slice(0,averageDays);

      let allRewards = filteredTxData.map(item => item.transfers[0].amount);
      let sumRewards = allRewards.reduce((a,b) => a + b, 0);
      let annualYield = 365.5*(sumRewards/averageDays)/10**6
      return <number>annualYield;

      //YY(d) = 100%*(reward(d)/100)*365.5
      //YY = average(YY(d))

    }

    public async getCirculatingSupply():Promise<number>{
      return <number>(await this.getTotalIssued() - await this.getStaked());
    }

    public async getCirculatingSupplyNoDec():Promise<number>{
      return <number>((await this.getTotalIssued() - await this.getStaked()) * (10 ** await this.getDecimals()));
    }

    public async getDeficit():Promise<number>{
      const assetDecimals = await this.getDecimals();
      const totalIssued = await this.getTotalIssued();


      const balanceLockWaves = Number((await nodeInteraction.accountDataByKey("balance_lock_waves", this.neutrinoContractAddress, this.nodeUrl)).value)/(10**assetDecimals);
      const reserve = await this.getBalance() - balanceLockWaves;
      const price = await this.getPrice();

      return<number>(totalIssued - reserve*price);
    }

    public async getDecimals():Promise<number>{
      const assetObject = await axios.get(this.nodeUrl+'assets/details/'+this.neutrinoAssetId);
      const assetDecimals = assetObject.data.decimals;

      return <number>(assetDecimals);
    }

    public async getLockedForSwap():Promise<number>{
      let lockedForSwapPauli = await axios.get(this.nodeUrl+'addresses/data/'+this.neutrinoContractAddress+'/'+'balance_lock_neutrino');
      let lockedForSwap = lockedForSwapPauli.data.value/1000000;
      return <number>(lockedForSwap);
    }

    public async getDeficitPerCent():Promise<number>{
      return <number>(-1*(await this.getDeficit()/await this.getTotalIssued()))*100;
    }

    public async getTotalBondsRest():Promise<number>{
      let orders_object = await axios.get('https://beta.neutrino.at/api/v1/bonds/usd-nb_usd-n/orders');
      let orders_object_data = orders_object.data;

      let restAmount = 0;
      for (let j of orders_object_data){
        let delta = j.restAmount;
        restAmount += delta;
      }

      return <number>(restAmount);
    }

    public async getTotalLiquidation():Promise<number>{
      let orders_object = await axios.get('https://beta.neutrino.at/api/v1/liquidate/usd-nb_usd-n/orders');
      let orders_object_data = orders_object.data;

      let restAmount = 0;
      for (let j of orders_object_data){
        let delta = j.restTotal;
        restAmount += delta;
      }
      console.log(restAmount)
      return <number>(restAmount);
    }

    // public async getLiquidateBondPrice():Promise<number>{
    //
    //   const assetDecimals = await this.getDecimals();
    //   const totalIssued = await this.getTotalIssued();
    //
    //   const balanceLockWaves = Number((await nodeInteraction.accountDataByKey("balance_lock_waves", this.neutrinoContractAddress, this.nodeUrl)).value)/(10**assetDecimals);
    //   const reserve = await this.getBalance() - balanceLockWaves;
    //
    //   let price = await this.getPrice();
    //
    //
    //   while(!(totalIssued > reserve*price)){
    //     price += 0.01
    //     price = price.toFixed(2);
    //   }
    //   price += 0.01
    //
    //   return <number>(price.toFixed(2));
    // }

}
