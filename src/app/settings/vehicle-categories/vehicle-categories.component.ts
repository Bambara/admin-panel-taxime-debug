import { Component, OnInit, ViewChild } from '@angular/core';
import { VehicleCategoryVM, PriceSelectionVM } from '../../shared/model/vehiclecategory';
import { SettingsService } from '../../shared/services/settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { ToasterService } from '../../shared';
import { environment } from '../../../environments/environment';
import { SnotifyService } from 'ng-snotify';
import { error } from 'util';

@Component({
    selector: 'app-vehicle-categories',
    templateUrl: './vehicle-categories.component.html',
    styleUrls: ['./vehicle-categories.component.scss']
})
export class VehicleCategoriesComponent implements OnInit {

    public vehicleCategoryVM: VehicleCategoryVM = {
        categoryName: null,
        subCategory: [],
        description: null,
        isEnable: false,
        categoryNo: 0,
        flag: null,
        recordedDateTime: new Date()
    }


    priceData: PriceSelectionVM = {}


    dtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 5
    };
    dtTrigger = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    public vehicleCategoryDataCollapse: Boolean[] = [];

    i = 0;
    imageSrc1: string | ArrayBuffer;
    imageSrc2: string | ArrayBuffer;
    imageSrc3: string | ArrayBuffer;
    imageSrc4: string | ArrayBuffer;
    imageSrc5: string | ArrayBuffer;

    addsub: boolean = false;
    selectedSubCats: any;
    subCatImg1: any;
    subCatImg2: any;
    subCatImg3: any;
    subCatImg4: any;
    subCatImg5: any;

    disableAddCategoryButtonFlag: boolean = false;
    saveType: string = "AddCat";

    categoryFlag: boolean = false;
    subCatFlag: boolean = false;
    PrSelFlag: boolean = false;
    VhAddFlag: boolean = false;

    formvalid: any;
    formvalid2: FormGroup;
    formvalid3: FormGroup;
    formvalid1: FormGroup;
    baseUrl: any;
    updateId: any;
    updateCatId: any;
    updateSubCatId: any;
    confirmAlertStatus: any;



    rerenderTable(): void {
        if (this.i == 0) {
            this.dtTrigger.next();
            this.i++;
            this.spinner.hide();
        }
        else {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.clear();
                dtInstance.destroy();
                this.dtTrigger.next();
                this.spinner.hide();
            });
        }
    }

    public DistPrice;
    public dist;
    public Distradius;

    public isCollapsed: Boolean[] = [];

    // public subCategories : SubCategoryVM[] = [];
    // public vehicles : VehicleVM[][] = [[]];


    public scatEnable = true;
    public vehEnable = true;
    public prEnable = true;
    public rdPrEnable = true;

    public districts: string[] = [
        "Jaffna",
        "Kilinochchi",
        "Mannar",
        "Mullaitivu",
        "Vavuniya",
        "Puttalam",
        "Kurunegala",
        "Gampaha",
        "Colombo",
        "Kalutara",
        "Anuradhapura",
        "Polonnaruwa",
        "Matale",
        "Kandy",
        "Nuwara Eliya",
        "Kegalle",
        "Ratnapura",
        "Eastern",
        "Trincomalee",
        "Batticaloa",
        "Ampara",
        "Badulla",
        "Monaragala",
        "Hambantota",
        "Matara",
        "Galle",
        "Madurai"];


    vehicleCategoryData: any;
    modelData: Promise<void>;

    public priceSel: PriceSelectionVM = {
        districtName: null,
        timeBase: []
    }

    public roadPickupPriceSel: PriceSelectionVM = {
        districtName: null,
        timeBase: []
    }

    constructor(
        public settingsService: SettingsService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private snotifyService: SnotifyService
        // public toasterService: ToasterService
    ) { }


    aaaa() {
        this.success('dsf');
    }

    ngOnInit() {
        this.getVehicleCategoryDetails();
        //this.getSubCatIcons();

        this.formvalid = new FormGroup({
            categoryName: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            categoryNo: new FormControl(''),
            isEnable: new FormControl('')
        })

        this.baseUrl = environment.imgApiBase;

        this.formvalid2 = new FormGroup({
            districtName: new FormControl('', Validators.required),
            // timeSlotName: new FormControl('', Validators.required),
            // startingTime: new FormControl('', Validators.required),
            // endingTime: new FormControl('', Validators.required),
            // districtPrice: new FormControl('', Validators.required),
            // baseFare: new FormControl('', Validators.required),
            // minimumFare: new FormControl('', Validators.required),
            // minimumKM: new FormControl('', Validators.required),
            // belowAboveKMRange: new FormControl('', Validators.required),
            // aboveKMFare: new FormControl('', Validators.required),
            // belowKMFare: new FormControl('', Validators.required),
            // trafficWaitingChargePerMinute: new FormControl('', Validators.required),
            // normalWaitingChargePerMinute: new FormControl('', Validators.required),
            // radius: new FormControl('', Validators.required),
            // packageDeliveryKMPerHour: new FormControl('', Validators.required),
            // packageDeliveryKMPerDay: new FormControl('', Validators.required)
        });

        this.formvalid3 = new FormGroup({
            ddistrictName: new FormControl('', Validators.required),
            // dtimeSlotName: new FormControl('', Validators.required),
            // dstartingTime: new FormControl('', Validators.required),
            // dendingTime: new FormControl('', Validators.required),
            // ddistrictPrice: new FormControl('', Validators.required),
            // dbaseFare: new FormControl('', Validators.required),
            // dminimumFare: new FormControl('', Validators.required),
            // dminimumKM: new FormControl('', Validators.required),
            // dbelowAboveKMRange: new FormControl('', Validators.required),
            // daboveKMFare: new FormControl('', Validators.required),
            // dbelowKMFare: new FormControl('', Validators.required),
            // dtrafficWaitingChargePerMinute: new FormControl('', Validators.required),
            // dnormalWaitingChargePerMinute: new FormControl('', Validators.required),
            // dradius: new FormControl('', Validators.required),
            // dpackageDeliveryKMPerHour: new FormControl('', Validators.required),
            // dpackageDeliveryKMPerDay: new FormControl('', Validators.required)
        });
    }


    getVehicleCategoryDetails() {
        this.spinner.show();

        this.vehicleCategoryDataCollapse = [];

        this.settingsService.getCategory()
            .subscribe(
                data => {
                    console.log(data);
                    this.vehicleCategoryData = data.content;
                    this.vehicleCategoryData.forEach(element => {
                        this.vehicleCategoryDataCollapse.push(true);
                    });
                    this.rerenderTable();
                    this.spinner.hide();
                },
                error => {
                    console.log(error);
                    this.spinner.hide();
                }
            );
    }

    open(content, i) {

        console.log(i);

        this.modelData = this.vehicleCategoryData[i].subCategory
        console.error(this.modelData);


        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
            // this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    public subCategoryFormValGroupName: FormGroup[] = [];

    addSubCat() {
        this.vehicleCategoryVM.subCategory.push({
            subCategoryName: null,
            subCategoryIcon: null,
            subCategoryIconSelected: null,
            subCategoryNo: 0,
            vehicles: [],
            priceSelection: [],
            roadPickupPriceSelection: [],
            subDescription: null,
            subIsEnable: true,
            packageDelivery: null,
            tripSendDriversCount : 4,
            higherBidTripChanceCount : 3,
            subCategorySkippingCount : 1,
            passengerCount : 3,
            driverTripTimerSecoends : 45
        });
        // this.AddVehicleToSubCat(this.vehicleCategoryVM.subCategory.length - 1)

        this.subCategoryFormValGroupName[this.vehicleCategoryVM.subCategory.length - 1] = this.getSubCatFormValidationGroup()
        //this.subCategories.push({});
        //this.vehicles.push([]);
        this.isCollapsed.push(false);
        this.vehicleFormValidGroupName.push([]);
    }

    getSubCatFormValidationGroup() {
        return new FormGroup({
            subCatName: new FormControl('', Validators.required),
            subDescription: new FormControl('', Validators.required),
            isEnable: new FormControl('')
        });
    }

    removeSubCat(i) {
        this.vehicleCategoryVM.subCategory.splice(i, 1);
        this.subCategoryFormValGroupName.splice(i, 1);
        //this.subCategories.splice(i,1);
        //this.vehicles.splice(i,1);
    }

    aaa() {
        console.error(this.vehicleFormValidGroupName);

    }

    public vehicleFormValidGroupName: FormGroup[][] = [[]]

    AddVehicleToSubCat(i) {
        console.warn(this.vehicleFormValidGroupName);

        this.vehicleCategoryVM.subCategory[i].vehicles.push({
            vehicleBrand: null,
            vehicleName: null,
            vehicleClass: null,
            modelType: null,
            modelCapacity: null,
            vehiclePassengerCount: null,
            vehicleCapacityWeightLimit: null,
            commission: {
                adminCommission: null,
                companyCommission: null
            }
        });
        //this.subCategories[i].vehicles.push({});
        // console.log(this.vehicles);
        this.vehicleFormValidGroupName[i][this.vehicleCategoryVM.subCategory[i].vehicles.length - 1] = this.createVehicleFormGroup()
        console.error(this.vehicleFormValidGroupName);

    }

    createVehicleFormGroup() {
        return new FormGroup({
            vehicleBrand: new FormControl('', Validators.required),
            vehicleName: new FormControl('', Validators.required),
            vehicleClass: new FormControl('', Validators.required),
            modelType: new FormControl('', Validators.required),
            modelCapacity: new FormControl('', Validators.required),
            vehiclePassengerCount: new FormControl('', Validators.required),
            vehicleCapacityWeightLimit: new FormControl('', Validators.required),
            adminCommission1: new FormControl(0),
            companyCommission1: new FormControl(0)

        });
    }

    removeVehicle(i, j) {
        this.vehicleCategoryVM.subCategory[i].vehicles.splice(j, 1);
        this.vehicleFormValidGroupName[i].splice(j, 1);
        //this.vehicles[i].splice(j,1);
    }

    save() {

        console.error(this.vehicleFormValidGroupName);

        console.warn(this.formvalid.valid);

        console.log(this.vehicleCategoryVM);
        console.log(this.saveType);


        //################ Check Category form ################
        if (this.formvalid.valid) {

            var tempError = '';
            var valid = true;

            console.warn(this.vehicleFormValidGroupName);
            this.subCategoryFormValGroupName.forEach((element, index) => {
                if (!element.valid) {
                    valid = false;
                    tempError = tempError + ' , ' + (index + 1);
                }
            });
            //################ Check sub Category form ################
            if (valid) {

                var tempError = '';
                var valid = true;

                console.warn(this.vehicleFormValidGroupName);


                this.vehicleFormValidGroupName.forEach((ele, index) => {
                    ele.forEach((element, idx) => {
                        if (!element.valid) {
                            valid = false;
                            tempError = tempError + ' , subCat : ' + (index + 1) + ' Vehicle : ' + (idx + 1);
                        }
                    });

                });
                //################ Check vehicle form ################
                if (valid) {

                    if (this.saveType == "AddSubCat") {
                        this.settingsService.addSubCategory(this.vehicleCategoryVM)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details);
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "AddCat") {
                        this.settingsService.addCategory(this.vehicleCategoryVM)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "updateCat") {
                        console.error('sdfjgsdf');

                        this.settingsService.updateCategory(this.vehicleCategoryVM, this.updateCatId)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "AddVehToSubCat") {

                        this.settingsService.addVehicleToSubCat(this.vehicleCategoryVM)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "AddPrToSubCat") {

                        this.settingsService.addPriceOfSubCat(this.vehicleCategoryVM)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "UpdtVehToSubCat") {

                        this.settingsService.updateVehicle(this.vehicleCategoryVM.categoryName, this.vehicleCategoryVM.subCategory[0].subCategoryName, this.vehicleCategoryVM.subCategory[0].vehicles[0])
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "UpdtPrToSubCat") {
                        this.addDistPrice(0)
                        console.error(this.vehicleCategoryVM.subCategory[0].priceSelection[0]);


                        this.settingsService.updatePriceOfSubCat(this.vehicleCategoryVM.categoryName, this.vehicleCategoryVM.subCategory[0].subCategoryName, this.vehicleCategoryVM.subCategory[0].priceSelection[0])
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "AddRdPrPrToSubCat") {
                        this.addDistPrice(0)

                        this.settingsService.addRdpickupPriceOfSubCat(this.vehicleCategoryVM)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }

                    //    
                    else if (this.saveType == "UpdtRdPrToSubCat") {
                        this.addDistPrice(0)

                        this.settingsService.updateRdpickupPriceOfSubCat(this.vehicleCategoryVM.categoryName, this.vehicleCategoryVM.subCategory[0].subCategoryName, this.vehicleCategoryVM.subCategory[0].roadPickupPriceSelection)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }
                    else if (this.saveType == "UpdateSubCat") {

                        this.settingsService.updateSubCategory(this.updateCatId, this.updateSubCatId,this.vehicleCategoryVM.categoryName, this.vehicleCategoryVM.subCategory[0].subCategoryName, this.vehicleCategoryVM.subCategory[0].subDescription, this.vehicleCategoryVM.subCategory[0].subIsEnable, this.vehicleCategoryVM.subCategory[0].packageDelivery,this.vehicleCategoryVM.subCategory[0].subCategoryNo,this.vehicleCategoryVM.subCategory[0].tripSendDriversCount,this.vehicleCategoryVM.subCategory[0].higherBidTripChanceCount,this.vehicleCategoryVM.subCategory[0].subCategorySkippingCount,this.vehicleCategoryVM.subCategory[0].driverTripTimerSecoends)
                            .subscribe(
                                data => {
                                    console.log(data);
                                    this.success(data.details)
                                    this.clearForm();
                                    this.getVehicleCategoryDetails();
                                }
                                , error => {
                                    console.log(error)
                                    // alert(error.details);
                                }
                            );
                    }

                }
                else {
                    this.error('Please Fill All Fields in vehicle No ' + tempError);
                }
            }
            else {
                this.error('Please Fill All Fields SubCategory ' + tempError);
            }
        }

        else {
            this.error('Please Fill Category Details');
        }


    }

    clearForm() {
        this.vehicleCategoryVM = {
            categoryName: null,
            subCategory: [],
            description: null,
            isEnable: true,
            categoryNo: null,
            flag: null,
            recordedDateTime: new Date()
        }
        this.addsub = false;
        this.saveType = "AddCat";
        this.categoryFlag = false;
        this.disableAddCategoryButtonFlag = false;
        this.subCatFlag = false;
        this.PrSelFlag = false;
        this.VhAddFlag = false;
        this.priceSel.timeBase = [];
        this.formvalid.enable();

        this.priceValidation = [];
        this.pickupPriceSelection = [];
        this.vehicleFormValidGroupName = [[]];
        this.subCategoryFormValGroupName = [];


        this.scatEnable = true;
        this.vehEnable = true;
        this.prEnable = true;
        this.rdPrEnable = true;
    }

    // #################### enable category ##################

    enableCategory(cData) {
        console.log(cData);

        this.settingsService.updateCategory(cData, cData._id)
            .subscribe(
                data => {
                    console.log(data);
                    this.success(data.details)
                    this.clearForm();
                    this.getVehicleCategoryDetails();
                }
                , error => {
                    console.log(error)
                    // alert(error.details);
                }
            );

    }

    //################## get sub cat icons ###########3

    getSubCatIcons(cat, i) {
        console.error('sjfg');

        // this.settingsService.getSubCatIcons()
        //     .subscribe(
        //         data => {
        //             console.error(data);

        //         },
        //         error => {
        //             console.log(error)
        //         }
        //     );
    }

    //############### price sel ###########3

    addDistPrice(i) {

        if (this.priceSel.timeBase.length > 0) {
            console.warn(this.formvalid2);
            console.error(this.priceValidation);

            var tempError = '';
            var valid = true;

            this.priceValidation.forEach((ele, idx) => {
                if (!ele.valid) {
                    valid = false;
                    tempError = tempError + ' , TimeBase : ' + (idx + 1);
                }
            }
            );


            if (this.formvalid2.valid) {
                if (valid) {
                    this.vehicleCategoryVM.subCategory[i].priceSelection.push(this.priceSel);

                    this.initPriceSel();
                }
                else {
                    this.error('Please Fill Required Fields in' + tempError)
                }
            }
            else {
                this.error('Please Fill District Feild')
            }

            console.log(this.priceSel);

        }
        else {
            this.error('No TimeBase To save')
        }

    }

    initPriceSel() {
        this.priceSel = {
            districtName: null,
            timeBase: []
        }
    }


    public priceValidation: FormGroup[] = [];
    public pickupPriceSelection: FormGroup[] = [];

    addTimeBase() {
        this.priceSel.timeBase.push({
            timeSlotName: null,
            startingTime: null,
            endingTime: null,
            districtPrice: null,
            baseFare: null,
            minimumFare: null,
            minimumKM: null,
            belowAboveKMRange: null,
            aboveKMFare: null,
            belowKMFare: null,
            trafficWaitingChargePerMinute: null,
            normalWaitingChargePerMinute: null,
            radius: null,
            packageDeliveryKMPerHour: null,
            packageDeliveryKMPerDay: null,
            tripCancelationFee : null,
            maxWaitingTimeWithoutCharge : null
        });

        this.priceValidation[this.priceSel.timeBase.length - 1] = this.getTimeBaseFormValidation()
        console.log(this.priceSel);

    }

    getTimeBaseFormValidation() {
        return new FormGroup({
            timeSlotName: new FormControl('', Validators.required),
            startingTime: new FormControl('', Validators.required),
            endingTime: new FormControl('', Validators.required),
            districtPrice: new FormControl('', Validators.required),
            lowerBidLimit: new FormControl('', Validators.required),
            upperBidLimit: new FormControl('', Validators.required),
            baseFare: new FormControl('', Validators.required),
            minimumFare: new FormControl('', Validators.required),
            minimumKM: new FormControl('', Validators.required),
            belowAboveKMRange: new FormControl('', Validators.required),
            aboveKMFare: new FormControl('', Validators.required),
            // belowKMFare: new FormControl('', Validators.required),
            trafficWaitingChargePerMinute: new FormControl('', Validators.required),
            normalWaitingChargePerMinute: new FormControl('', Validators.required),
            radius: new FormControl('', Validators.required),
            packageDeliveryKMPerHour: new FormControl('', Validators.required),
            packageDeliveryKMPerDay: new FormControl('', Validators.required),
            tripCancelationFee: new FormControl('', Validators.required),
            maxWaitingTimeWithoutCharge: new FormControl('', Validators.required)
        });
    }

    getPickupTimeBaseFormValidation() {
        return new FormGroup({
            dtimeSlotName: new FormControl('', Validators.required),
            dstartingTime: new FormControl('', Validators.required),
            dendingTime: new FormControl('', Validators.required),
            ddistrictPrice: new FormControl('', Validators.required),
            dbaseFare: new FormControl('', Validators.required),
            dminimumFare: new FormControl('', Validators.required),
            dminimumKM: new FormControl('', Validators.required),
            dbelowAboveKMRange: new FormControl('', Validators.required),
            daboveKMFare: new FormControl('', Validators.required),
            dbelowKMFare: new FormControl('', Validators.required),
            dtrafficWaitingChargePerMinute: new FormControl('', Validators.required),
            dnormalWaitingChargePerMinute: new FormControl('', Validators.required),
            dradius: new FormControl('', Validators.required),
            dpackageDeliveryKMPerHour: new FormControl('', Validators.required),
            dpackageDeliveryKMPerDay: new FormControl('', Validators.required)
        });
    }

    //############## road pickup Price sel ###########

    addroadPickupPistPrice(i) {
        console.log(this.priceSel);

        console.error(this.formvalid3);
        console.error(this.roadPickupPriceSel);
        console.error(this.pickupPriceSelection);


        if (this.roadPickupPriceSel.timeBase.length > 0) {

            var tempError = '';
            var valid = true;

            this.pickupPriceSelection.forEach((ele, idx) => {
                if (!ele.valid) {
                    valid = false;
                    tempError = tempError + ' , TimeBase : ' + (idx + 1);
                }
            }
            );

            if (this.formvalid3.valid) {
                if (valid) {
                    this.vehicleCategoryVM.subCategory[i].roadPickupPriceSelection.push(this.roadPickupPriceSel);

                    this.initroadPickupPriceSel();
                }
                else {
                    this.error('Please Fill Required Fields in' + tempError)
                }
            }
            else {
                this.error('Please Fill District Field')
            }
        }
        else {
            this.error('No TimeBase To save')
        }
    }

    initroadPickupPriceSel() {
        this.roadPickupPriceSel = {
            districtName: null,
            timeBase: []
        }
    }

    addroadPickupTimeBase() {
        this.roadPickupPriceSel.timeBase.push({
            timeSlotName: null,
            startingTime: null,
            endingTime: null,
            districtPrice: null,
            lowerBidLimit: null,
            upperBidLimit: null,
            baseFare: null,
            minimumFare: null,
            minimumKM: null,
            belowAboveKMRange: null,
            aboveKMFare: null,
            belowKMFare: null,
            trafficWaitingChargePerMinute: null,
            normalWaitingChargePerMinute: null,
            radius: null,
            packageDeliveryKMPerHour: null,
            packageDeliveryKMPerDay: null
        });

        this.pickupPriceSelection[this.roadPickupPriceSel.timeBase.length - 1] = this.getPickupTimeBaseFormValidation()
        console.log('*************', this.pickupPriceSelection);

    }

    //####################################

    SelectSubCategoryIcon(cat, sCat, event) {
        if (event.target.files && event.target.files[0]) {
            //     this.vehicleCategoryVM.subCategory[0].subCategoryIcon = event.target.files[0];
            const file = event.target.files[0];
            this.subCatImg1 = event.target.files[0];

            const reader = new FileReader();
            reader.onload = e => this.imageSrc1 = reader.result;

            reader.readAsDataURL(file);

            this.settingsService.imageUploadSubCategory(cat, sCat, this.subCatImg1)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.message)
                        this.clearForm();
                        //this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    SelectSubCategoryIconSelected(cat, sCat, event) {

        if (event.target.files && event.target.files[0]) {
            // this.vehicleCategoryVM.subCategory[0].subCategoryIconSelected = event.target.files[0];
            const file = event.target.files[0];
            this.subCatImg2 = event.target.files[0];

            const reader = new FileReader();
            reader.onload = e => this.imageSrc2 = reader.result;

            reader.readAsDataURL(file);

            this.settingsService.imageUploadSubCategorySelected(cat, sCat, this.subCatImg2)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.message)
                        this.clearForm();
                        //this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    SelectSubCategoryMapIcon(cat, sCat, event) {
        if (event.target.files && event.target.files[0]) {
            //     this.vehicleCategoryVM.subCategory[0].subCategoryIcon = event.target.files[0];
            const file = event.target.files[0];
            this.subCatImg3 = event.target.files[0];

            const reader = new FileReader();
            reader.onload = e => this.imageSrc3 = reader.result;

            reader.readAsDataURL(file);

            this.settingsService.imageUploadSubCategoryMapIcon(cat, sCat, this.subCatImg3)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.message)
                        this.clearForm();
                        //this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    SelectSubCategoryMapIconOffline(cat, sCat, event) {
        if (event.target.files && event.target.files[0]) {
            //     this.vehicleCategoryVM.subCategory[0].subCategoryIcon = event.target.files[0];
            const file = event.target.files[0];
            this.subCatImg4 = event.target.files[0];

            const reader = new FileReader();
            reader.onload = e => this.imageSrc4 = reader.result;

            reader.readAsDataURL(file);

            this.settingsService.imageUploadSubCategoryMapIconOffline(cat, sCat, this.subCatImg4)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.message)
                        this.clearForm();
                        //this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    SelectSubCategoryMapIconOntrip(cat, sCat, event) {
        if (event.target.files && event.target.files[0]) {
            //     this.vehicleCategoryVM.subCategory[0].subCategoryIcon = event.target.files[0];
            const file = event.target.files[0];
            this.subCatImg5 = event.target.files[0];

            const reader = new FileReader();
            reader.onload = e => this.imageSrc5 = reader.result;

            reader.readAsDataURL(file);

            this.settingsService.imageUploadSubCategoryMapIconOntrip(cat, sCat, this.subCatImg5)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.message)
                        this.clearForm();
                        //this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    // uploadImages(cat, scat) {
    //     this.settingsService.addSubCatIcons(cat, scat, this.subCatImg1, this.subCatImg2, this.subCatImg3)
    //         .subscribe(
    //             data => {
    //                 console.log(data);
    //                 alert(data.details)
    //                 this.clearForm();
    //                 this.getVehicleCategoryDetails();
    //             }
    //             , error => {
    //                 console.log(error)
    //                 // alert(error.details);
    //             }
    //         );
    // }

    delete(i) {
        this.settingsService.deleteVehicleCategory(this.vehicleCategoryData[i].categoryName)
            .subscribe(
                data => {
                    console.log(data);
                    this.success(data.details)
                    this.getVehicleCategoryDetails();
                }
                , error => {
                    console.log(error)
                    this.error(error.details);
                }
            );
    }

    addSubCategory(i) {
        console.log(this.vehicleCategoryData[i].categoryName);
        this.vehicleCategoryVM.categoryName = this.vehicleCategoryData[i].categoryName;
        this.isCollapsed.push(false);
        this.addsub = true;
    }


    addPrice(content2, i) {
        this.selectedSubCats = this.vehicleCategoryData[i].subCategory
        console.log(this.selectedSubCats);
        //  this.priceData.categoryName = this.vehicleCategoryData[i].categoryName


        this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
            // this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

    }

    savePrices() {
        console.log(this.priceData);
        this.settingsService.vehicleCategoryPriceAdd(this.priceData)
            .subscribe(
                data => {
                    console.log(data);
                    this.success(data.details)
                    this.getVehicleCategoryDetails();
                }
                , error => {
                    console.log(error)
                    this.error(error.details);
                }
            );

    }

    removeDistPrice(i, q) {
        this.vehicleCategoryVM.subCategory[i].priceSelection.splice(q, 1);
    }

    removeRdPickupDistPrice(i, q) {
        this.vehicleCategoryVM.subCategory[i].roadPickupPriceSelection.splice(q, 1);
    }


    //###################### update #########

    addNewSubCat(cat, catDes) {
        window.scroll(0, 0);
        //this.clearForm();
        this.categoryFlag = true;
        this.saveType = "AddSubCat";

        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: catDes,
            categoryNo: 0,
            isEnable: true,
            flag: null,
            recordedDateTime: new Date()
        }

        this.addSubCat();

    }

    UpdateCategory(cat, des, isEnable, id) {

        this.scatEnable = false;
        this.updateCatId = id

        window.scroll(0, 0);
        this.disableAddCategoryButtonFlag = true;
        this.saveType = "updateCat"

        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: des,
            isEnable: isEnable,
            categoryNo: 0,
            flag: null,
            recordedDateTime: new Date()
        }
    }

    UpdateSubCategory(i, j) {
        // window.scroll(0, 0);
        this.categoryFlag = true;
        // this.formvalid.disable();
        this.saveType = "UpdateSubCat";

        this.vehicleCategoryVM = {
            categoryName: this.vehicleCategoryData[i].categoryName,
            subCategory: [],
            description: this.vehicleCategoryData[i].description,
            categoryNo: this.vehicleCategoryData[i].categoryNo,
            isEnable: this.vehicleCategoryData[i].isEnable,
            flag: null,
            recordedDateTime: new Date()
        }

        this.updateCatId = this.vehicleCategoryData[i]._id
        this.updateSubCatId = this.vehicleCategoryData[i].subCategory[j]._id
        //this.addSubCat();
        console.error(this.vehicleCategoryData[i].subCategory[j]);

        this.vehicleCategoryVM.subCategory.push(this.vehicleCategoryData[i].subCategory[j]);
        // this.vehicleCategoryVM.subCategory[0].priceSelection = [];
        this.vehicleCategoryVM.subCategory[0].roadPickupPriceSelection = [];
        this.vehicleCategoryVM.subCategory[0].vehicles = [];
        this.subCategoryFormValGroupName[0] = this.getSubCatFormValidationGroup()
        this.vehicleFormValidGroupName[0][this.vehicleCategoryVM.subCategory[i].vehicles.length - 1] = this.createVehicleFormGroup()
    }

    //############### delete ###############
    deleteCategory(cat) {
        if (confirm("Are you sure to delete Category " + cat)) {
            this.settingsService.deleteVehicleCategory(cat)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.details)
                        this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    deleteSubCategory(cat, scat) {
        if (confirm("Are you sure to delete subCategory " + cat + " : " + scat)) {
            this.settingsService.deleteSubCategory(cat, scat)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.details)
                        this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    deleteVehicle(cat, scat, model) {
        if (confirm("Are you sure to delete vehicle " + cat + " : " + scat + " : " + model)) {
            this.settingsService.deleteVehicle(cat, scat, model)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.details)
                        this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    deleteDistPrice(cat, scat, dist) {
        if (confirm("Are you sure to delete price " + cat + " : " + scat + " : " + dist)) {
            this.settingsService.deletePriceOfSubCat(cat, scat, dist)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.details)
                        this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    //################## Vehicle and Price ###########
    addNewVehicleToSubCat(cat, catDes, scat, sdes, i, j) {


        window.scroll(0, 0);
        this.clearForm();
        this.categoryFlag = true;
        this.subCatFlag = true;
        this.PrSelFlag = true;
        this.disableAddCategoryButtonFlag = true;
        this.saveType = "AddVehToSubCat";



        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: catDes,
            categoryNo: 0,
            isEnable: true,
            flag: null,
            recordedDateTime: new Date()
        }

        this.addSubCat();
        this.vehicleCategoryVM.subCategory[0].subCategoryName = scat
        this.vehicleCategoryVM.subCategory[0].subDescription = sdes

        this.AddVehicleToSubCat(0);
        // this.formvalid.disable();
        //this.subCategoryFormValGroupName[0].disable();
    }

    editNewVehicleToSubCat(cat, catDes, scat, sdes, i, j, k) {
        console.log(i);
        window.scroll(0, 0);

        this.clearForm();
        this.categoryFlag = true;
        this.subCatFlag = true;
        this.PrSelFlag = true;
        this.VhAddFlag = true;
        this.disableAddCategoryButtonFlag = true;
        this.saveType = "UpdtVehToSubCat";
        //this.formvalid.disable();

        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: catDes,
            isEnable: true,
            flag: null,
            recordedDateTime: new Date()
        }

        this.addSubCat();
        this.vehicleCategoryVM.subCategory[0].subCategoryName = scat
        this.vehicleCategoryVM.subCategory[0].subDescription = sdes
        //this.AddVehicleToSubCat(0);
        console.log(this.vehicleCategoryData);

        this.vehicleCategoryVM.subCategory[0].vehicles.push(this.vehicleCategoryData[i].subCategory[j].vehicles[k]);
        this.vehicleFormValidGroupName[0][this.vehicleCategoryVM.subCategory[0].vehicles.length - 1] = this.createVehicleFormGroup()
        // this.subCategoryFormValGroupName[0].disable();
    }

    addNewPriceToSubCat(cat, catDes, scat, sdes, i, j) {
        window.scroll(0, 0);
        this.clearForm();
        this.categoryFlag = true;
        this.subCatFlag = true;
        this.VhAddFlag = true;
        this.disableAddCategoryButtonFlag = true;
        this.saveType = "AddPrToSubCat";

        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: catDes,
            categoryNo: 0,
            isEnable: true,
            flag: null,
            recordedDateTime: new Date()
        }
        //this.formvalid.disable();

        this.addSubCat();
        this.vehicleCategoryVM.subCategory[0].subCategoryName = scat
        this.vehicleCategoryVM.subCategory[0].subDescription = sdes
        this.addTimeBase();
        //this.subCategoryFormValGroupName[0].disable();
    }

    updateNewPriceToSubCat(cat, catDes, scat, sdes, i, j, k) {
        window.scroll(0, 340);
        console.log(i);
        this.clearForm();
        // this.categoryFlag = true;
        // this.subCatFlag = true;
        // this.PrSelFlag = true;
        // this.VhAddFlag = true;
        // this.disableAddCategoryButtonFlag = true;

        console.log(sdes);

        this.saveType = "UpdtPrToSubCat";

        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: catDes,
            categoryNo: 0,
            isEnable: true,
            flag: null,
            recordedDateTime: new Date()
        }
        //this.formvalid.disable();

        this.addSubCat();
        this.vehicleCategoryVM.subCategory[0].subCategoryName = scat
        this.vehicleCategoryVM.subCategory[0].subDescription = sdes
        // this.initPriceSel();
        // this.addTimeBase();
        console.warn(this.vehicleCategoryData[i]);
        console.warn(this.vehicleCategoryData[i].subCategory[j].priceSelection[k].timeBase[0].timeSlotName);

        this.priceSel = {
            districtName: this.vehicleCategoryData[i].subCategory[j].priceSelection[k].districtName,
            timeBase: []
        }
        console.log(this.priceSel);

        this.vehicleCategoryData[i].subCategory[j].priceSelection[k].timeBase.forEach(element => {
            this.priceValidation.push(this.getTimeBaseFormValidation());
        });

        this.priceSel = {
            districtName: this.vehicleCategoryData[i].subCategory[j].priceSelection[k].districtName,
            timeBase: this.vehicleCategoryData[i].subCategory[j].priceSelection[k].timeBase
        };

        console.error(this.priceSel);

        // this.priceSel.districtName = this.vehicleCategoryData[i].subCategory[j].priceSelection[k].districtName
        // console.log(this.vehicleCategoryData[i].subCategory[j].priceSelection[k].districtName);

        //this.subCategoryFormValGroupName[0].disable();

    }

    addNewRoadPickupPriceToSubCat(cat, catDes, scat, sdes, i, j) {
        window.scroll(0, 0);
        this.clearForm();
        this.categoryFlag = true;
        this.subCatFlag = true;
        this.VhAddFlag = true;
        this.disableAddCategoryButtonFlag = true;
        this.saveType = "AddRdPrPrToSubCat";

        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: catDes,
            categoryNo: 0,
            isEnable: true,
            flag: null,
            recordedDateTime: new Date()
        }
        //this.formvalid.disable();

        this.addSubCat();
        this.vehicleCategoryVM.subCategory[0].subCategoryName = scat
        this.vehicleCategoryVM.subCategory[0].subDescription = sdes
        this.addroadPickupTimeBase();
        //this.subCategoryFormValGroupName[0].disable();
    }

    updateNewRoadPickupPriceToSubCat(cat, catDes, scat, sdes, i, j, k) {
        window.scroll(0, 0);
        console.log(i);

        this.clearForm();
        // this.categoryFlag = true;
        // this.subCatFlag = true;
        // this.PrSelFlag = true;
        // this.VhAddFlag = true;
        // this.disableAddCategoryButtonFlag = true;
        this.saveType = "UpdtRdPrToSubCat";

        this.vehicleCategoryVM = {
            categoryName: cat,
            subCategory: [],
            description: catDes,
            isEnable: true,
            flag: null,
            recordedDateTime: new Date()
        }
        // this.formvalid.disable();

        this.addSubCat();
        this.vehicleCategoryVM.subCategory[0].subCategoryName = scat
        this.vehicleCategoryVM.subCategory[0].subDescription = sdes
        // this.initPriceSel();
        // this.addTimeBase();
        this.addroadPickupTimeBase();
        console.warn(this.vehicleCategoryData[i]);
        console.warn(this.vehicleCategoryData[i].subCategory[j].roadPickupPriceSelection[k].timeBase[0].timeSlotName);

        this.priceSel = {
            districtName: this.vehicleCategoryData[i].subCategory[j].roadPickupPriceSelection[k].districtName,
            timeBase: []
        }
        console.log(this.priceSel);

        this.vehicleCategoryData[i].subCategory[j].roadPickupPriceSelection[k].timeBase.forEach(element => {
            this.priceValidation.push(this.getPickupTimeBaseFormValidation());
        });

        this.roadPickupPriceSel = {
            districtName: this.vehicleCategoryData[i].subCategory[j].roadPickupPriceSelection[k].districtName,
            timeBase: this.vehicleCategoryData[i].subCategory[j].roadPickupPriceSelection[k].timeBase
        };

        // this.priceSel.districtName = this.vehicleCategoryData[i].subCategory[j].priceSelection[k].districtName
        // console.log(this.vehicleCategoryData[i].subCategory[j].priceSelection[k].districtName);
        // this.subCategoryFormValGroupName[0].disable();

    }

    deleteRoadPickupPrice(cat, scat, dist) {
        if (confirm("Are you sure to delete price " + cat + " : " + scat + " : " + dist)) {
            this.settingsService.deleteRoadPickupPrice(cat, scat, dist)
                .subscribe(
                    data => {
                        console.log(data);
                        this.success(data.details)
                        this.getVehicleCategoryDetails();
                    }
                    , error => {
                        console.log(error)
                        // alert(error.details);
                    }
                );
        }
    }

    //######## remove time base #########
    removePriceSel(p) {
        this.priceSel.timeBase.splice(p, 1);
        this.priceValidation.splice(p, 1);
    }

    removeRoadPickupPriceSel(q) {
        this.roadPickupPriceSel.timeBase.splice(q, 1);
        this.pickupPriceSelection.splice(q, 1);
    }


    success(msg) {
        this.snotifyService.success(msg, {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: "rightTop"
        })
    }

    error(msg) {
        this.snotifyService.error(msg, {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: "rightTop"
        })
    }

    info(msg) {
        this.snotifyService.info(msg, {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: "rightTop"
        })
    }

    /* author : ghost */
    showConfirmDialog(funcName, data, msg) {
        this.snotifyService.confirm(msg, {
            timeout: 10000,
            showProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            position: "rightTop",
            buttons: [
                {text: 'Yes', action: () => {this.askConfirmation(true, funcName, data)}, bold: false},
                {text: 'No', action: () => {this.askConfirmation(false, funcName, data)}},
                // {text: 'Later', action: (toast) => {console.log('Clicked: Later'); service.remove(toast.id); } },
                //{text: 'Close', action: (toast) => {console.log('Clicked: No'); service.remove(toast.id); }, bold: true},
            ]
        })
    }

    askConfirmation(status, funcName, data) {
        console.log(status)

        if (status) {
            if (funcName == 'enableCategory') {
                this.enableCategory(data);
            }
            
        }
    }


}
