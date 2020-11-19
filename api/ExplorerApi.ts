import axios from 'axios';
import { nodeInteraction } from '@waves/waves-transactions';
import { indexBy, prop, defaultTo } from 'ramda';
import { BigNumber } from '@waves/bignumber';

import { NeutrinoContractKeys } from './contractKeys/NeutrinoContractKeys';
import { ControlContractKeys } from './contractKeys/ControlContractKeys';
import { RpdContractKeys } from './contractKeys/RpdContractKeys';
import { AuctionContractKeys } from './contractKeys/AuctionContractKeys';


export class ExplorerApi {
    static readonly WAVELET: number = (10 ** 8);
    static readonly EXP: number = 2.718281;
    static readonly DEFAULT_NSBT_CURVE_PARAM_A: number = 3;
    neutrinoContractAddress: string;
    auctionContractAddress: string;
    controlContractAddress: string;
    rpdContractAddress: string;
    nodeUrl: string;
    neutrinoAssetId: string;
    bondAssetId: string;
    liquidationContractAddress: string;
    assetDecimals: number;

    public static create(nodeUrl: string, neutrinoContractAddress: string): Promise<ExplorerApi> {
        return axios.post(`${nodeUrl}addresses/data/${neutrinoContractAddress}`, {
            keys: [
                NeutrinoContractKeys.AuctionContractAddressKey,
                NeutrinoContractKeys.ControlContractAddressKey,
                NeutrinoContractKeys.LiquidationContractAddressKey,
                NeutrinoContractKeys.RpdContractAddressKey,
                NeutrinoContractKeys.NeutrinoAssetIdKey,
                NeutrinoContractKeys.BondAssetIdKey,
            ]
        }).then((response) => {
            const map: Record<string, { key: string, value: any }> = indexBy(prop('key'), response.data);

            const auctionContractAddress = <string>map[NeutrinoContractKeys.AuctionContractAddressKey].value;
            const controlContractAddress = <string>map[NeutrinoContractKeys.ControlContractAddressKey].value;
            const liquidationContractAddress = <string>map[NeutrinoContractKeys.LiquidationContractAddressKey].value;
            const rpdContractAddress = <string>map[NeutrinoContractKeys.RpdContractAddressKey].value;
            const neutrinoAssetId = <string>map[NeutrinoContractKeys.NeutrinoAssetIdKey].value;
            const bondAssetId = <string>map[NeutrinoContractKeys.BondAssetIdKey].value;

            return axios.get<{ decimals: number }>(`${nodeUrl}assets/details/${neutrinoAssetId}`)
                .then((detailsResponse) => new ExplorerApi({
                    nodeUrl,
                    neutrinoContractAddress,
                    auctionContractAddress,
                    controlContractAddress,
                    liquidationContractAddress,
                    rpdContractAddress,
                    neutrinoAssetId,
                    bondAssetId,
                    assetDecimals: detailsResponse.data.decimals
                }));
        });
    }

    private constructor({
                            nodeUrl,
                            neutrinoContractAddress,
                            auctionContractAddress,
                            controlContractAddress,
                            liquidationContractAddress,
                            rpdContractAddress,
                            neutrinoAssetId,
                            bondAssetId,
                            assetDecimals
    }: ExplorerApiOption){
        this.neutrinoContractAddress = neutrinoContractAddress;
        this.auctionContractAddress = auctionContractAddress;
        this.controlContractAddress = controlContractAddress;
        this.liquidationContractAddress = liquidationContractAddress;
        this.rpdContractAddress = rpdContractAddress;

        this.neutrinoAssetId = neutrinoAssetId;
        this.bondAssetId = bondAssetId;
        this.nodeUrl = nodeUrl;
        this.assetDecimals = assetDecimals;
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
      return <number>(await nodeInteraction.accountDataByKey(AuctionContractKeys.NeutrinoLockedBalanceKey, this.neutrinoContractAddress, this.nodeUrl)).value;
    }

    private async getWavesLockedBalance(): Promise<number>{
      return <number>(await nodeInteraction.accountDataByKey(AuctionContractKeys.WavesLockedBalanceKey, this.neutrinoContractAddress, this.nodeUrl)).value;
    }

    private getSmartContractAddresses(){
      console.log(this.neutrinoContractAddress,this.auctionContractAddress,this.controlContractAddress,this.liquidationContractAddress,this.rpdContractAddress);
    }

    private async calculateBR(): Promise<string> {
      const neutrinoBalance = await this.getNeutrinoBalance(this.neutrinoContractAddress);
      const liquidationBalance = await this.getNeutrinoBalance(this.liquidationContractAddress);
      
      const neutrinoSupply = await this.getNeutrinoLockedBalance() + await this.getAssetQuantity() - neutrinoBalance - liquidationBalance;
      
      const neutrinoBalanceWaves = <number>(await nodeInteraction.balanceDetails(this.neutrinoContractAddress, this.nodeUrl)).regular;
      
      const reserves = neutrinoBalanceWaves - await this.getWavesLockedBalance();
      
      const price = await this.getPrice() * 10 ** this.assetDecimals;

      const _reserves = new BigNumber(reserves);
      const _price = new BigNumber(price);
      const _PAULI = new BigNumber(Math.pow(10, 6));

      const fraction1 = _reserves.mul(_price).div(1000000).roundTo(0, BigNumber.ROUND_MODE.ROUND_DOWN);
      const reservesInUSDN = fraction1.mul(_PAULI).div(ExplorerApi.WAVELET).roundTo(0, BigNumber.ROUND_MODE.ROUND_DOWN);
      
      return reservesInUSDN.div(neutrinoSupply).toFixed(12, BigNumber.ROUND_MODE.ROUND_DOWN);
    }

    //Public API methods
    public async getPrice():Promise<any> {
      return <number>(await nodeInteraction.accountDataByKey(ControlContractKeys.PriceKey, this.controlContractAddress, this.nodeUrl)).value/(10 ** this.assetDecimals);
    }

    public async getBR():Promise<any> {
      return parseFloat(await this.calculateBR());
    }

    public async getNSBTPrice():Promise<any> {
      const a = defaultTo(
        ExplorerApi.DEFAULT_NSBT_CURVE_PARAM_A, 
        <number>prop('value', (await nodeInteraction.accountDataByKey(AuctionContractKeys.NSBTCurveParamA, this.neutrinoContractAddress, this.nodeUrl)))
      );
      const BR = parseFloat(await this.calculateBR());

      const price = BR >= 1 ? Math.pow(ExplorerApi.EXP, a * (BR - 1)) : 1/(2 - BR);
      
      return price.toFixed(this.assetDecimals);
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
      return (await nodeInteraction.balance(this.neutrinoContractAddress, this.nodeUrl)/ExplorerApi.WAVELET);
    }

    public async getTotalIssued():Promise<number>{
      const neutrinoBalance = await this.getNeutrinoBalance(this.neutrinoContractAddress)/(10**this.assetDecimals);
      const liquidationBalance = await this.getNeutrinoBalance(this.liquidationContractAddress)/(10**this.assetDecimals);
      const balanceLockNeutrino = Number((await nodeInteraction.accountDataByKey("balance_lock_neutrino", this.neutrinoContractAddress, this.nodeUrl)).value)/(10**this.assetDecimals);

      return <number>(10**12-neutrinoBalance-liquidationBalance+Number(balanceLockNeutrino));
    }

    public async getStaked():Promise<number>{
      return <number>(await nodeInteraction.accountDataByKey(RpdContractKeys.BalanceKey+"_"+this.neutrinoAssetId, this.rpdContractAddress, this.nodeUrl)).value/10**this.assetDecimals;
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
      const stakingAddress = "3P5X7AFNSTjcVoYLXkgRNTqmp51QcWAVESX";
      const txObject = await axios.get(this.nodeUrl+'transactions/address/'+stakingAddress+'/limit/99');
      const txData = txObject.data[0];

      const filteredTxData = txData.filter(item => String(item.sender) === String('3PMj3yGPBEa1Sx9X4TSBFeJCMMaE3wvKR4N')).slice(0,averageDays);

      let allRewards = filteredTxData.map(item => item.transfers[0].amount);
      let sumRewards = allRewards.reduce((a,b) => a + b, 0);
      let averageReward = sumRewards / sumRewards.length;
      let annualYield = 365.5*averageReward/10**6
      return <number>annualYield;

    }

    public async getCirculatingSupply():Promise<number>{
      return <number>(await this.getTotalIssued() - await this.getStaked());
    }

    public async getCirculatingSupplyNoDec():Promise<number>{
      return <number>((await this.getTotalIssued() - await this.getStaked()) * (10 ** this.assetDecimals));
    }

    public async getDeficit(totalIssued: number): Promise<number> {
        const balanceLockWaves = Number((await nodeInteraction.accountDataByKey('balance_lock_waves', this.neutrinoContractAddress, this.nodeUrl)).value) / (10 ** this.assetDecimals);
        const reserve = await this.getBalance() - balanceLockWaves;
        const price = await this.getPrice();

        return (totalIssued - reserve * price);
    }

    public async getLockedForSwap():Promise<number>{
      let lockedForSwapPauli = await axios.get(this.nodeUrl+'addresses/data/'+this.neutrinoContractAddress+'/'+'balance_lock_neutrino');
      let lockedForSwap = lockedForSwapPauli.data.value/1000000;
      return <number>(lockedForSwap);
    }

    public async getDeficitPerCent(): Promise<number> {
        const totalIssued = await this.getTotalIssued();
        return (-1 * (await this.getDeficit(totalIssued) / totalIssued)) * 100;
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

type ExplorerApiOption = {
    nodeUrl: string;
    neutrinoContractAddress: string;
    auctionContractAddress: string;
    controlContractAddress: string;
    liquidationContractAddress: string;
    rpdContractAddress: string;
    neutrinoAssetId: string;
    bondAssetId: string;
    assetDecimals: number;
} ;
