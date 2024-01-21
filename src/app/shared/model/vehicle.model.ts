export class VehicleModel {
    vehicleCategoryName: string;
    vehicleSubcategoryName: string;
    vehicleCategory?: string;
    vehicleSubCategory?: string;
    ownerContactName: string;
    ownerContactNumber: string;
    ownerContactEmail: string;
    address: string;
    street: string;
    city: string;
    zipcode: string;
    country: string;
    driverId: string;
    ownerVerify: string;
    vehicleRevenueNo: string;
    vehicleRevenueExpiryDate: Date;
    vehicleLicenceNo: string;
    vehicleRegistrationNo: string;
    vehicleColor: string;
    manufactureYear: string;
    vehicleBrandName: string;
    vehicleBookPic: File;
    vehicleInsurancePic: File;
    vehicleFrontPic: File;
    vehicleSideViewPic: File;
    vehicleRevenuePic: File;
    id?: string;
}