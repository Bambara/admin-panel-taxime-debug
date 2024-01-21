import { SubCategoryVM } from "./subcategoryVM";

export interface VehicleCategoryVM {
    categoryName?: string,
    subCategory?: SubCategoryVM[],
    description?: string,
    isEnable?:Boolean,
    categoryNo?:Number,
    flag?:string,
    recordedDateTime?:Date
}
