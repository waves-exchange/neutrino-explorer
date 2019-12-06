import { nodeInteraction } from "@waves/waves-transactions"
import { NeutrinoContractKeys } from "./contractKeys/NeutrinoContractKeys";
import { ControlContractKeys } from "./contractKeys/ControlContractKeys";
import { accountData, accountDataByKey } from "@waves/waves-transactions/dist/nodeInteraction";
import { OrderKeys } from "./contractKeys/OrderKeys";

export class ExplorerApi {
    static readonly WAVELET: number = (10 ** 8);
    neutrinoContractAddress: string;
    auctionContractAddress: string;
    controlContractAddress: string;
    nodeUrl: string;
    neutrinoAssetId: string;
    bondAssetId: string;
    liquidationContract: string;

    public static async create(nodeUrl: string, neutrinoContractAddress: string){
        const accountDataState = await nodeInteraction.accountData(neutrinoContractAddress, nodeUrl);
        const auctionContractAddress = <string>accountDataState[NeutrinoContractKeys.AuctionContractAddressKey].value
        const controlContractAddress = <string>accountDataState[NeutrinoContractKeys.ControlContractAddressKey].value
        const neutrinoAssetId = <string>accountDataState[NeutrinoContractKeys.NeutrinoAssetIdKey].value
        const bondAssetId = <string>accountDataState[NeutrinoContractKeys.BondAssetIdKey].value
        const liquidationContract = <string>accountDataState[NeutrinoContractKeys.LiquidationContractAddressKey].value
        return new ExplorerApi(nodeUrl, neutrinoContractAddress, auctionContractAddress, controlContractAddress, liquidationContract, neutrinoAssetId, bondAssetId)
    }

    public constructor(nodeUrl: string, neutrinoContractAddress: string, auctionContractAddress: string, controlContractAddress: string, liquidationContract: string, neutrinoAssetId: string, bondAssetId: string){
        this.neutrinoContractAddress = neutrinoContractAddress;
        this.auctionContractAddress = auctionContractAddress;
        this.controlContractAddress = controlContractAddress;
        this.neutrinoAssetId = neutrinoAssetId;
        this.bondAssetId = bondAssetId;
        this.liquidationContract = liquidationContract;
        this.nodeUrl = nodeUrl;
    }

    public async getPrice(): Promise<number> {
        return <number>(await nodeInteraction.accountDataByKey(ControlContractKeys.PriceKey, this.controlContractAddress, this.nodeUrl)).value/100;
    }

    public async getBalance():Promise<number> {
      return <number>(await nodeInteraction.balance(this.neutrinoContractAddress, this.nodeUrl)/ExplorerApi.WAVELET);
    }

}
