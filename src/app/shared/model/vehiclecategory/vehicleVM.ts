import { SubCategoryVM } from "./subcategoryVM";

export interface VehicleVM {
    vehicleBrand?:string,
    vehicleName?:string,
    vehicleClass?:string,
    modelType?:string,
    modelCapacity?:string,
    vehiclePassengerCount?:string,
    vehicleCapacityWeightLimit?:string,
    commission? : {
        adminCommission?:string,
        companyCommission?:string
    }    
}
