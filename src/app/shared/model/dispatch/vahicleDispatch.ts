export interface vahicleDispatch {
    dispatcherId?: string,
    customerName?: string,
    customerTelephoneNo?: string,
    customerEmail?: string,
    noOfPassengers?: number,
    pickupDate?: string,
    pickupTime?: string,
    pickupLocation?:{
        address?: string,
        latitude?: number,
        longitude?: number
    },
    dropLocations?:[{
        address?: string,
        latitude?: number,
        longitude?: number
    }],
    distance?: number,
    vehicleCategory?: string,
    vehicleSubCategory?: string,
    hireCost?: number,
    totalPrice?: number,
    notes?: string,
    type?: string,
    validTime?: number,
    operationRadius?: number,
    bidValue ?: number
}