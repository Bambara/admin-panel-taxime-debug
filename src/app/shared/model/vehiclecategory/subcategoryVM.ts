import { VehicleVM } from './index';
import { CommissionVM } from './commissionVM';
import { PriceSelectionVM } from './priceSelectionVM';

export interface SubCategoryVM {
    subCategoryName?:string,                       
    subCategoryIcon?:string,
    subCategoryIconSelected?: any,
    vehicles? : VehicleVM[],   
    subCategoryNo?:number, 
    priceSelection? :PriceSelectionVM[],
    roadPickupPriceSelection? : PriceSelectionVM[],
    subDescription?:string,      
    subIsEnable?: Boolean,
    packageDelivery?: Boolean,
    tripSendDriversCount?:number,
    higherBidTripChanceCount?:number,
    subCategorySkippingCount?: number,
    passengerCount?: number,
    driverTripTimerSecoends?: number
}
