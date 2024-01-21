import { Component, OnInit, ViewChild, ElementRef, NgZone, Injectable, ChangeDetectorRef } from '@angular/core';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { } from 'googlemaps';
import { TripService } from '../../shared/services/trip/trip.service';
import { GetCategoryService } from '../../shared/services/trip/get-category.service';
import { environment } from '../../../environments/environment';
import { vahicleDispatch } from '../../shared/model/dispatch/vahicleDispatch';
import { from, Subject } from 'rxjs';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { SnotifyService } from 'ng-snotify';
import { DashboardService } from '../../shared/services/dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import * as io from 'socket.io-client';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare const google: any;

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-dispatch',
    templateUrl: './trips-booking.component.html',
    styleUrls: ['./trips-booking.component.css']
})
export class TripsBookingComponent implements OnInit {
    
    currency = environment.CURRENCY;
  title: string = 'Book a Ride';
  // zoom: number;
  myLocation1: Position;

  public uri = environment.apiBase;

  public origin: any
  public destination: any

  public searchControl: FormControl;
  public searchControl1: FormControl;

  private searchTerm: string;
  private results$: Observable<any[]>;

  public place1;
  public originAddress;

  public place2;
  public destinationAddress;



  lat: number[] = [6.903585, 51.678418];
  lng: number[] = [79.921341, 7.809007];

  zoom: number = 15;

  public getDirection = false;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild("search1")
  public searchElementRef1: ElementRef;

    myLocationAddress: any;
    destination1: any;
  vahicleCategory: any[];
  vahicleCategory1: any[];
  categoryName: any;
  subCategoryImg: any;

  bidValue = 30;

  today = new Date();

  testResult = [{ description: 'test' }, { description: 'test' }];
  vehicleTrackingData: any = [];

  registerForm: FormGroup;

  distanceFormated: any;

  today1 = new Date();
  today2 = new Date();

  from; to;

  failedDispatches: any = [];

  buttonPressCount = 0;

  vehicleCategoryData = [];

  private socket;
  vehicleTrackingDataTemp: any;

  filterCategory = 'all';
  filterStatus = 'canceled';
  textData = '0';

  //********************************************** */
  config: any;
  pageNo: any = 1;
  total: any = 0;
  pages: number;

  pagination(items, pageNo) {

    this.config = {
      itemsPerPage: 15,
      currentPage: pageNo,
      totalItems: this.total
    };
  }

  pageChanged(event) {
    this.config.currentPage = event;
    console.log(event);
    this.pageNo = event;
    this.getFailedDispatchesPagination();

  }
  /*********************************************** */


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private tripService: TripService,
    private getCategory: GetCategoryService,
    private snotifyService: SnotifyService,
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
  ) { }

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    order: [0, 'desc']
  };

  dtTrigger = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  interval;


    ngOnInit() {

        this.callOnInit();

        this.socket = io(environment.ws_url, {
            transports: ['polling']
        });

        this.socket.on('connect', () => {
            localStorage.setItem('socketId', this.socket.id);
            console.log(localStorage.getItem('socketId'));
        });

        // this.getFailedDispatchesPagination();

        this.socketHandle();

        this.searchElementRef;
        this.searchElementRef1;

        this.getVehicleTracking();
        this.formData();

        this.interval = setInterval(() => {
            console.log("########### socket handle ###########");
            // this.getVehicleTracking();
            // this.getFailedDispatches();
            this.socketHandle();
        }, 10000);


        this.interval = setInterval(() => {
            console.log("########### socket handle failed dispatch ###########");
            // this.getVehicleTracking();
            this.socketHandleToFailedDisapatches();

        }, 60000);

        /* run the function getVehicleTracking every 15 seconds */
        this.interval = setInterval(() => {
            console.log("##### pull vehicle data #####");
            this.getVehicleTracking();
        }, 30000);


        // this.dispatch.pickupDate = "2019-4-3"

        this.dispatch.pickupDate = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
        this.dispatch.pickupTime = (this.today.getHours() < 10 ? '0' + this.today.getHours() : this.today.getHours()) + ":" + (this.today.getMinutes() < 10 ? '0' + this.today.getMinutes() : this.today.getMinutes());

        this.today2.setDate(this.today1.getDate() + 1);
        //this.from = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + this.today1.getDate();
        //this.to = this.today2.getFullYear() + '-' + ((this.today2.getMonth() + 1) > 9 ? '' : '0') + (this.today2.getMonth() + 1) + '-' + (this.today2.getDate() > 9 ? '' : '0') + (this.today2.getDate());
        
        this.getFailedDispatchesPagination();
        // this.getFailedDispatches();

    }

    socketHandle() {
        this.socket.emit('adminConnected', { adminId: localStorage.getItem('userId') })

        this.socket.emit('getOnlineDriversBylocation', { socketId: localStorage.getItem('socketId') })

        this.socket.on('allOnlineDriversResult', (data) => {
            this.vehicleTrackingDataTemp = data;
            this.iterationCategory1();
        });

    }

    iterationCategory() {
        this.vehicleTrackingDataTemp.forEach(element => {
            if (element.vehicleCategoryData.subCategory.length > 0) {
                if (element.vehicleCategoryData.subCategory[0].mapIcon) {

                    if (element.currentStatus == 'offline') {
                        element.driverIcon = {
                            url: element.vehicleCategoryData.subCategory[0].mapIconOffline,
                            scaledSize: {
                                width: 40,
                                height: 35
                            }
                        }
                    }
                    else if (element.currentStatus == 'online') {
                        element.driverIcon = {
                            url: element.vehicleCategoryData.subCategory[0].mapIcon,
                            scaledSize: {
                                width: 40,
                                height: 35
                            }
                        }
                    }
                    // (element.currentStatus == 'online')
                    else {
                        element.driverIcon = {
                            url: element.vehicleCategoryData.subCategory[0].mapIconOntrip,
                            scaledSize: {
                                width: 40,
                                height: 35
                            }
                        }

                    }
                }
                else {
                // element.driverIcon = {
                //   url: '../../../assets/images/blueping.png',
                //   scaledSize: {
                //     width: 55,
                //     height: 55
                //   }
                // }
                }
            }
        });

        console.log("vehicleTrackingDataTemp");
        console.log(this.vehicleTrackingDataTemp);
        this.vehicleTrackingData = this.vehicleTrackingDataTemp;
        this.vehicleTrackingDataBackup = this.vehicleTrackingDataTemp;
        this.filterVehicleTracking(this.type);

    }

    iterationCategory1() {
        var temp;
        var tempStatus;

        this.vehicleTrackingData.forEach(element => {
            temp = this.vehicleTrackingDataTemp.filter(el => el.driverId == element.driverId);

            if (temp[0]) 
            {
                // console.log(temp[0]);
                element.currentLocation.address = temp[0].currentLocation.address
                element.currentLocation.latitude = temp[0].currentLocation.latitude
                element.currentLocation.longitude = temp[0].currentLocation.longitude
                element.vehicleCategory = temp[0].vehicleCategory
                element.vehicleSubCategory = temp[0].vehicleSubCategory
                element.vehicleInfo.vehicleRegistrationNo = temp[0].vehicleInfo.vehicleRegistrationNo

                if (element.currentStatus != temp[0].currentStatus) {

                    element.currentStatus = temp[0].currentStatus

                    if (element.currentStatus == 'offline') {
                        element.driverIcon = {
                            url: element.vehicleCategoryData.subCategory[0].mapIconOffline,
                            scaledSize: {
                                width: 40,
                                height: 35
                            }
                        }
                    }
                    else if (element.currentStatus == 'online') {
                        element.driverIcon = {
                            url: element.vehicleCategoryData.subCategory[0].mapIcon,
                            scaledSize: {
                                width: 40,
                                height: 35
                            }
                        }
                    }
                    // (element.currentStatus == 'online')
                    else {
                        element.driverIcon = {
                            url: element.vehicleCategoryData.subCategory[0].mapIconOntrip,
                            scaledSize: {
                                width: 40,
                                height: 35
                            }
                        }
                    }
                }

                this.vehicleTrackingDataTemp = this.vehicleTrackingDataTemp.filter(el => !(el.driverId == element.driverId));
            }
            else 
            {
                this.vehicleTrackingData = this.vehicleTrackingData.filter(el => !(el.driverId == element.driverId));
                // }
                // console.log(this.vehicleTrackingDataTemp);
                // console.log(this.vehicleTrackingData);
            }

        });

        if (this.vehicleTrackingDataTemp.length > 0) {

            this.vehicleTrackingDataTemp.forEach(element => {
                if (element.vehicleCategoryData.subCategory.length > 0) {
                    if (element.vehicleCategoryData.subCategory[0].mapIcon) {

                        if (element.currentStatus == 'offline') {
                            element.driverIcon = {
                                url: element.vehicleCategoryData.subCategory[0].mapIconOffline,
                                scaledSize: {
                                    width: 40,
                                    height: 35
                                }
                            }
                        }
                        else if (element.currentStatus == 'online') {
                            element.driverIcon = {
                                url: element.vehicleCategoryData.subCategory[0].mapIcon,
                                scaledSize: {
                                    width: 40,
                                    height: 35
                                }
                            }
                        }
                        // (element.currentStatus == 'online')
                        else {
                        element.driverIcon = {
                            url: element.vehicleCategoryData.subCategory[0].mapIconOntrip,
                            scaledSize: {
                                width: 40,
                                height: 35
                            }
                        }

                        }

                        this.vehicleTrackingData.push(element);
                    }
                    else {
                        // element.driverIcon = {
                        //   url: '../../../assets/images/blueping.png',
                        //   scaledSize: {
                        //     width: 55,
                        //     height: 55
                        //   }
                        // }
                    }
                }
            });
        }
        // console.log(this.vehicleTrackingData);
        // this.vehicleTrackingData = this.vehicleTrackingDataTemp;
        this.vehicleTrackingDataBackup = this.vehicleTrackingData;
        this.filterVehicleTracking(this.type);

    }

    socketHandleToFailedDisapatches() {

        this.socket.emit('getFailedDispatches', { socketId: localStorage.getItem('socketId'), from: this.from, to: this.to, pageNo: this.pageNo, status: this.filterStatus, category: this.filterCategory, text: this.textData })

        this.socket.on('allFailedDispatches', (data) => {
        this.failedDispatches = data.content;

        data.content1.forEach(element => {
          this.failedDispatches.push(element);
        });
        this.failedDispatches.sort((el1, el2) => {

          if (el1.recordedTime > el2.recordedTime)
            return -1;
          if (el1.recordedTime < el2.recordedTime)
            return 1;

        });
        this.failedDispatchesTemp = this.failedDispatches;
        // console.error(this.failedDispatches);
        // this.filterFailedDispatches();
        if (this.failedDispatches.length > 0) {
            this.rerenderTable();
        }
        });

    }

  //***************************************** */

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  excelData = [];

  exportAsXLSX(): void {

    this.failedDispatches.forEach(element => {

      if (element.type == 'passengerTrip') {

        this.excelData.push({
          Name: element.passengerDetails.name,
          Mobile: element.passengerDetails.contactNumber
        });

      } else {

        this.excelData.push({
          Name: element.customerName,
          Mobile: element.customerTelephoneNo
        });
      }

      this.excelData.push({
        HireCost: element.hireCost,
        VehicleCategory: element.vehicleCategory,
        EvehicleSubCategory: element.vehicleSubCategory,
        BidValue: element.bidValue,
        Type: element.type,
        PickupLocation: element.pickupLocation.address,
        PickupDateTime: element.pickupDateTime,
        DropLocations: element.dropLocations[0].address,
        Distance: element.distance,
        // address: element.address.address + " , " + element.address.street + " , " + element.address.city,
        // lifeInsuranceNo: element.lifeInsuranceNo,
        // RegisteredDate: element.recordedTime.split('T')[0] + '  ' + element.recordedTime.split('T')[1].split('Z')[0],
      });

    });

    this.exportAsExcelFile(this.excelData, 'Failed Dispatches History');
  }
  //***************************************** */

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    public dispatch: vahicleDispatch = {
        dispatcherId: null,
        customerName: null,
        customerTelephoneNo: null,
        customerEmail: null,
        noOfPassengers: null,
        // pickupDate: ,
        // pickupTime: null,
        pickupLocation: {
            address: null,
            latitude: null,
            longitude: null
        },
        dropLocations: [{
            address: null,
            latitude: null,
            longitude: null
        }],
        distance: null,
        vehicleCategory: null,
        vehicleSubCategory: null,
        hireCost: null,
        totalPrice: null,
        notes: null,
        type: null,
        validTime: null,
        operationRadius: null,
        bidValue: null
    };

    changeBid(op) {
        if (op == 'm') {
            this.bidValue = this.bidValue - 1;
        }
        else {
            this.bidValue = this.bidValue + 1;
        }
        this.checkEnable();
        this.calculateCost();
    }

    callOnInit() {

        // this.getFailedDispatches();

        //create search FormControl
        this.searchControl = new FormControl();
        this.searchControl1 = new FormControl();

        //set current position
        this.setCurrentPosition();

        //load Places Autocomplete for pickup location
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            });

            autocomplete.setComponentRestrictions({ 'country': ['lk'] });

            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }

                this.dispatch.pickupLocation.address = place.formatted_address;
                console.log(place.formatted_address);
                this.myLocationAddress = place.formatted_address
                console.log("this.myLocationAddress");
                console.log(this.myLocationAddress);


                //set latitude, longitude and zoom
                this.lat[0] = place.geometry.location.lat();
                this.lng[0] = place.geometry.location.lng();
                this.place1 = place;
                this.zoom = 12;

                this.dispatch.pickupLocation.latitude = place.geometry.location.lat();
                this.dispatch.pickupLocation.longitude = place.geometry.location.lng();

                this.origin = { lat: this.lat[0], lng: this.lng[0] }
                localStorage.setItem('origin', place.formatted_address);
                this.getVehicleCategory(this.origin);
                this.calculateDistance();
                });
            });
        });

        //load Places Autocomplete for destination
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef1.nativeElement, {
                // types: ["address"]
            });
            autocomplete.setComponentRestrictions({ 'country': ['lk'] });

            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    console.log(place.formatted_address);
                    this.dispatch.dropLocations[0].address = place.formatted_address;
                    this.dispatch.dropLocations[0].latitude = place.geometry.location.lat();
                    this.dispatch.dropLocations[0].longitude = place.geometry.location.lng();

                    //set latitude, longitude and zoom
                    this.lat[1] = place.geometry.location.lat();
                    this.lng[1] = place.geometry.location.lng();
                    this.zoom = 12;

                    this.place2 = place;
                    this.destination = { lat: this.lat[1], lng: this.lng[1] }
                    localStorage.setItem('destination', place.formatted_address);
                    this.calculateDistance();
                    this.getDirection = true;

                });
            });
        });
    }

    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((data) => {
                this.place1 = data;
                this.myLocation1 = data;

                console.log(data);
                this.dispatch.pickupLocation.latitude = data.coords.latitude;
                this.dispatch.pickupLocation.longitude = data.coords.longitude;
                this.lat[0] = data.coords.latitude;
                this.lng[0] = data.coords.longitude;
                this.zoom = 12;

                this.origin = { lat: this.lat[0], lng: this.lng[0] }

                this.tripService.getCurrentLocationData(data.coords.latitude, data.coords.longitude)
                .subscribe(
                    data => {
                    localStorage.setItem('origin', data['results'][0].formatted_address);
                    console.log(data);
                    this.dispatch.pickupLocation.address = data['results'][0].formatted_address;
                    this.myLocationAddress = data['results'][0].formatted_address;

                    this.getVehicleCategory(this.origin);
                    },
                    error => {
                    console.log(error);
                    }
                );

            });
        }
    }

    /* set current location */
    myLocation() {
        this.setCurrentPosition();
        console.log(this.myLocation1);
        this.dispatch.pickupLocation.latitude = this.myLocation1.coords.latitude;
        this.dispatch.pickupLocation.longitude = this.myLocation1.coords.longitude;
        this.origin = { lat: this.myLocation1.coords.latitude, lng: this.myLocation1.coords.longitude }
    }

    dragEndOrigin(event) {
        // console.log(event);
        // console.log(event['coords'].lat);
        this.dispatch.pickupLocation.latitude = event.coords.lat;
        this.dispatch.pickupLocation.longitude = event.coords.lng;
        this.lat[0] = event.coords.lat;
        this.lng[0] = event.coords.lng;

        this.origin = { lat: event['coords'].lat, lng: event['coords'].lng }

        this.tripService.getCurrentLocationData(event['coords'].lat, event['coords'].lng)
        .subscribe(
            data => {
                console.log(data);
                this.dispatch.pickupLocation.address = data['results'][0].formatted_address;
                this.myLocationAddress = data['results'][0].formatted_address;
                localStorage.setItem('origin', data['results'][0].formatted_address);
                this.getVehicleCategory(this.origin);
                this.calculateDistance();
            },
            error => {
                console.log(error);
            }
        );
    }

    dragEndDestination(event) {
        // console.log(event);
        // this.dispatch.dropLocation.address = place.formatted_address;
        this.dispatch.dropLocations[0].latitude = event['coords'].lat;
        this.dispatch.dropLocations[0].longitude = event['coords'].lng;

        this.destination = { lat: event['coords'].lat, lng: event['coords'].lng }

        this.tripService.getCurrentLocationData(event['coords'].lat, event['coords'].lng)
        .subscribe(
            data => {
                console.log(data);
                this.dispatch.dropLocations[0].address = data['results'][0].formatted_address;
                this.destination1 = data['results'][0].formatted_address;
                localStorage.setItem('origin', data['results'][0].formatted_address);
                this.calculateDistance();
            },
            error => {
                console.log(error);
            }
        );
    }

    clearOrigin() {
        this.myLocationAddress = null;
    }

    clearDestination() {
        this.destination1 = null;
    }

    //##################################################################################
    getVehicleCategory(location) {

        this.vehicleCategoryData = [];

        this.tripService.getCategory(location, this.dispatch.pickupDate, this.dispatch.pickupTime).subscribe(
        data => {
            // this.categoryName = data['content'][0]['categoryName'];
            // this.subCategoryImg = data['content'][0]['subCategory'];

            this.vehicleCategoryData.push({
                name: 'all',
                count: 0
            })
            data.content.forEach(element => {
                this.vehicleCategoryData.push({
                    name: element.subCategoryName,
                    count: 0
                })
            });

            this.vahicleCategory = data['content'];

            this.dispatch.vehicleCategory = this.vahicleCategory[0]['categoryTag'];
            this.dispatch.vehicleSubCategory = this.vahicleCategory[0]['subCategoryName'];

            this.bidValue = this.vahicleCategory[0]['lowerBidLimit'];

            this.vahicleCategory.forEach(element => {
                element.selected = false;
                element.enabled = false;
            });

            this.dispatch.operationRadius = this.vahicleCategory[0].priceSelection[0].timeBase[0].radius;

            this.vahicleCategory[0].selected = true;
            this.vahicleCategory[0].enabled = true;

            this.dispatch.noOfPassengers = this.vahicleCategory[0].passengerCount;

            console.log(this.vahicleCategory);

        }, error => {
            console.log(error);
        });
    }

    /* distance calculate */
    calculateDistance() {
        const start = new google.maps.LatLng(this.dispatch.pickupLocation.latitude, this.dispatch.pickupLocation.longitude);
        const end = new google.maps.LatLng(this.dispatch.dropLocations[0].latitude, this.dispatch.dropLocations[0].longitude);

        // this.dispatch.distance = google.maps.geometry.spherical.computeDistanceBetween(start, end) / 1000;

        var self = this;

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
        {
            origins: [start],
            destinations: [end],
            travelMode: 'DRIVING'
        }, callback);

        function callback(response, status) {
            console.log(response)
            console.log(response.rows[0].elements[0].distance.value / 1000);
            console.log(response.rows[0].elements[0].distance.text);

            self.distanceFormated = response.rows[0].elements[0].distance.text;
            self.dispatch.distance = response.rows[0].elements[0].distance.value / 1000;
            self.calculateCost();
            self.ref.detectChanges();

        }

    }

    // calculateCost() {

    //     this.dispatch.distance = parseFloat(this.dispatch.distance.toFixed(2));
    //     // this.dispatch.hireCost = this.dispatch.distance * this.bidValue;

    //     //console.error(this.dispatch.vehicleCategory, this.dispatch.vehicleSubCategory);
        
    //     console.log("this.dispatch.vehicleCategory, this.dispatch.vehicleSubCategory");
    //     console.log(this.dispatch.vehicleCategory, this.dispatch.vehicleSubCategory);


    //     console.warn(this.vahicleCategory.filter(el => el.categoryTag == this.dispatch.vehicleCategory && el.subCategoryName == this.dispatch.vehicleSubCategory)[0]);


    //     var priceSel = this.vahicleCategory.filter(el => el.categoryTag == this.dispatch.vehicleCategory && el.subCategoryName == this.dispatch.vehicleSubCategory)[0].priceSelection[0].timeBase[0];
    //     console.warn(priceSel);

    //     if (this.dispatch.distance <= priceSel.minimumKM) {
    //         this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare;
    //         console.warn(priceSel);
    //     }
    //     else if (this.dispatch.distance <= priceSel.belowAboveKMRange) {
    //     this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare + (this.bidValue * (this.dispatch.distance - priceSel.minimumKM));
    //     console.warn(priceSel);
    //     }
    //     else if (this.dispatch.distance > priceSel.belowAboveKMRange) {
    //     this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare + (this.bidValue * (priceSel.belowAboveKMRange - priceSel.minimumKM)) + (priceSel.aboveKMFare * (this.dispatch.distance - priceSel.belowAboveKMRange));
    //     console.warn(priceSel);
    //     }

    //     this.dispatch.hireCost = parseFloat(this.dispatch.hireCost.toFixed(2));
    //     console.log(this.dispatch.hireCost);

    //     if (this.bidValue == 0) {
    //     this.dispatch.hireCost = 0;
    //     }

    //     if (this.vahicleCategory.filter(el => el.categoryTag == this.dispatch.vehicleCategory && el.subCategoryName == this.dispatch.vehicleSubCategory)[0].priceSelection[0].timeBase.length > 1) {
    //     this.dispatch.hireCost = 0;
    //     }
    // }

    /* author : ghost - new calculation */
    calculateCost() {

        if (this.dispatch.distance != null) {
            this.dispatch.distance = parseFloat(this.dispatch.distance.toFixed(1));
        }
        
        // this.dispatch.hireCost = this.dispatch.distance * this.bidValue;

        //console.error(this.dispatch.vehicleCategory, this.dispatch.vehicleSubCategory);
        
        console.log("this.dispatch.vehicleCategory, this.dispatch.vehicleSubCategory");
        console.log(this.dispatch.vehicleCategory, this.dispatch.vehicleSubCategory);


        console.warn(this.vahicleCategory.filter(el => el.categoryTag == this.dispatch.vehicleCategory && el.subCategoryName == this.dispatch.vehicleSubCategory)[0]);


        var priceSel = this.vahicleCategory.filter(el => el.categoryTag == this.dispatch.vehicleCategory && el.subCategoryName == this.dispatch.vehicleSubCategory)[0].priceSelection[0].timeBase[0];
        console.warn(priceSel);

        if (this.dispatch.distance <= priceSel.minimumKM) {
            this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare;
            console.warn(priceSel);
        }
        else if (priceSel.belowAboveKMRange > 0) {
            if (this.dispatch.distance <= priceSel.belowAboveKMRange) {

                this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare + (this.bidValue * (this.dispatch.distance - priceSel.minimumKM));
                console.warn(priceSel);

            } else if (this.dispatch.distance > priceSel.belowAboveKMRange) {
                this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare + (this.bidValue * (priceSel.belowAboveKMRange - priceSel.minimumKM)) + (priceSel.aboveKMFare * (this.dispatch.distance - priceSel.belowAboveKMRange));
                console.warn(priceSel);
            }
        } else {
            this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare + (this.bidValue * (this.dispatch.distance - priceSel.minimumKM));
            console.warn(priceSel);
        }

        // else if (this.dispatch.distance <= priceSel.belowAboveKMRange) {
        // this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare + (this.bidValue * (this.dispatch.distance - priceSel.minimumKM));
        // console.warn(priceSel);
        // }
        // else if (this.dispatch.distance > priceSel.belowAboveKMRange) {
        // this.dispatch.hireCost = priceSel.minimumFare + priceSel.baseFare + (this.bidValue * (priceSel.belowAboveKMRange - priceSel.minimumKM)) + (priceSel.aboveKMFare * (this.dispatch.distance - priceSel.belowAboveKMRange));
        // console.warn(priceSel);
        // }
        console.log(this.dispatch.hireCost);
        this.dispatch.hireCost = parseFloat(this.dispatch.hireCost.toFixed(2));
        console.log(this.dispatch.hireCost);

        if (this.bidValue == 0) {
            this.dispatch.hireCost = 0;
        }

        if (this.vahicleCategory.filter(el => el.categoryTag == this.dispatch.vehicleCategory && el.subCategoryName == this.dispatch.vehicleSubCategory)[0].priceSelection[0].timeBase.length > 1) {
            this.dispatch.hireCost = 0;
        }
    }

  manualCustomers = [];

  getManualCustomers() {


    if (this.dispatch.customerTelephoneNo.length > 3) {
      this.dashboardService.getManualCustomers(this.dispatch.customerTelephoneNo)
        .subscribe(
          data => {
            console.log(data);
            this.manualCustomers = data['content'];
          },
          error => { }
        )
    }
    else {
      this.manualCustomers = [];
    }
  }

  onClickSearchItem(i) {
    this.dispatch.customerTelephoneNo = this.manualCustomers[i].mobile;
    this.dispatch.customerName = this.manualCustomers[i].firstName;
    this.manualCustomers = [];
  }


    formData() {
        this.registerForm = this.formBuilder.group({
            searchControl: [''],
            searchControl1: [''],
            customerName: [''],
            customerTelephoneNo: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
            customerEmail: ['', [Validators.email]],
            noOfPassengers: [''],
            pickupDate: [''],
            pickupTime: [''],
            operationRadius: [''],
        });
    }

  get validate() {
    return this.registerForm.controls;
  }

    onSubmit() {

        if (this.buttonPressCount == 0) {
            
            console.log("buttonPressCount");

            this.spinner.show();
            this.buttonPressCount++;

            // this.calculateDistance();
            if (!this.redispatch) {
                this.dispatch.dispatcherId = localStorage.getItem('userId')
                this.dispatch.type = "adminDispatch";
            }
            // this.dispatch.hireCost = 0;
            this.dispatch.totalPrice = 0;
            this.dispatch.validTime = 45;
            this.dispatch.bidValue = this.bidValue;

            console.log(this.registerForm);

            if (this.registerForm.invalid) {
                this.spinner.hide();
                this.error('Please fill customer mobile No');

            } else {
                this.tripService.adminadddispatch(this.dispatch).
                subscribe((response) => {
                    this.buttonPressCount = 0;
                    console.log(response);
                    this.spinner.hide();
                    this.success(response['details']);
                    if (response['message'] == 'success') {

                        // this.dispatch = {}

                        this.dispatch.customerEmail = null;
                        this.dispatch.customerName = null;
                        this.dispatch.customerTelephoneNo = null;
                        this.dispatch.noOfPassengers = null;
                        this.dispatch.notes = null;

                        this.dispatch.pickupDate = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
                        this.dispatch.pickupTime = (this.today.getHours() < 10 ? '0' + this.today.getHours() : this.today.getHours()) + ":" + (this.today.getMinutes() < 10 ? '0' + this.today.getMinutes() : this.today.getMinutes());

                        // this.getFailedDispatches();
                        this.redispatch = false;
                        this.buttonPressCount = 0;

                        /* close modal */
                        this.hideModal();
                    }
                    else { }

                }, error => {
                    this.spinner.hide();
                    this.buttonPressCount = 0;
                    this.error(error.message)
                });
            }
        }
        else {
            this.error('Request already in processing');
            this.buttonPressCount = 0;
        }
    }

    /* select vehicle category image function */
    selectCategory(i) {
        this.checkEnable();

        this.vahicleCategory.forEach(element => {
            // element.enabled = false;
            element.selected = false;
        });

        this.dispatch.vehicleCategory = this.vahicleCategory[i].categoryTag;
        this.dispatch.vehicleSubCategory = this.vahicleCategory[i].subCategoryName;

        this.dispatch.operationRadius = this.vahicleCategory[i].priceSelection[0].timeBase[0].radius;

        this.vahicleCategory[i].selected = true;
        this.vahicleCategory[i].enabled = true;
        this.dispatch.noOfPassengers = this.vahicleCategory[i].passengerCount;

        console.log("bidValue: "+this.bidValue);
        
        /* old bid value check */
        // if (this.bidValue == 0) {
        //     console.log(this.vahicleCategory[i]);

        //     this.bidValue = this.vahicleCategory[i].lowerBidLimit
        //     console.error(this.bidValue);
        // }
        // else if (this.vahicleCategory[i].lowerBidLimit <= this.bidValue) {

        // }
        // else {
        //     this.bidValue = this.vahicleCategory[i].lowerBidLimit
        // }

        this.bidValue = this.vahicleCategory[i].lowerBidLimit

        this.calculateCost();
    }

    checkEnable() {
        this.vahicleCategory.forEach(element => {
            element.enabled = false;
            // element.selected = false;
        });

        this.vahicleCategory.forEach(element => {
            if (this.bidValue >= element.lowerBidLimit) {
                element.enabled = true;
            }
        });
    }


  getVehicleTracking() {
    this.dashboardService.getVehicleTracking()
      .subscribe(
        data => {
          this.vehicleTrackingData = data['content'];

          this.vehicleTrackingData.forEach(element => {
            if (element.vehicleCategoryData.subCategory.length > 0) {
              if (element.vehicleCategoryData.subCategory[0].mapIcon) {


                if (element.currentStatus == 'offline') {
                  element.driverIcon = {
                    url: element.vehicleCategoryData.subCategory[0].mapIconOffline,
                    scaledSize: {
                      width: 40,
                      height: 35
                    }
                  }
                }
                else if (element.currentStatus == 'online') {
                  element.driverIcon = {
                    url: element.vehicleCategoryData.subCategory[0].mapIcon,
                    scaledSize: {
                      width: 40,
                      height: 35
                    }
                  }
                }
                // (element.currentStatus == 'online')
                else {
                  element.driverIcon = {
                    url: element.vehicleCategoryData.subCategory[0].mapIconOntrip,
                    scaledSize: {
                      width: 40,
                      height: 35
                    }
                  }

                }
              }
              else {
                // element.driverIcon = {
                //   url: '../../../assets/images/blueping.png',
                //   scaledSize: {
                //     width: 55,
                //     height: 55
                //   }
                // }
              }
            }
          });

          this.vehicleTrackingDataBackup = this.vehicleTrackingData;
          this.filterVehicleTracking(this.type);
        },
        error => { }
      )
  }

  vehicleTrackingDataBackup;
  type = 'all';
  type2 = 'all';

  countAll = 0;
  countOnline = 0;
  countOffline = 0;
  countOntrip = 0;

  filterVehicleTracking(type) {
    this.type = type;

    if (type == 'all') {
      this.vehicleTrackingData = this.vehicleTrackingDataBackup;
    }
    else if (type == 'online') {
      this.vehicleTrackingData = this.vehicleTrackingDataBackup.filter(el => el.currentStatus == 'online');
    }
    else if (type == 'offline') {
      this.vehicleTrackingData = this.vehicleTrackingDataBackup.filter(el => el.currentStatus == 'offline');
    }
    else if (type == 'ontrip') {
      this.vehicleTrackingData = this.vehicleTrackingDataBackup.filter(el => el.currentStatus == 'onTrip');
    }

    this.countAll = this.vehicleTrackingDataBackup.length;
    this.countOnline = this.vehicleTrackingDataBackup.filter(el => el.currentStatus == 'online').length;
    this.countOffline = this.vehicleTrackingDataBackup.filter(el => el.currentStatus == 'offline').length;
    this.countOntrip = this.vehicleTrackingDataBackup.filter(el => el.currentStatus == 'onTrip').length;

    this.filterVehicleTracking2(this.type2)
  }

  filterVehicleTracking2(type) {
    this.type2 = type;
    if (this.type2 != 'all') {
      this.vehicleTrackingData = this.vehicleTrackingDataBackup.filter(el => el.vehicleSubCategory == this.type2);
    }

    this.vehicleCategoryData[0].count = this.countAll;

    this.vehicleCategoryData.forEach(element => {
      element.count = this.vehicleTrackingDataBackup.filter(el => el.vehicleSubCategory == element.name).length
    });

  }

  failedDispatchesTemp = [];
  failedDispatchesTemp0 = [];

  filterFailedDispatches() {
    this.failedDispatchesTemp0 = [];

    if (this.filterStatus == 'all') {
      this.failedDispatchesTemp0 = this.failedDispatchesTemp;
    }
    else {
      this.failedDispatchesTemp0 = this.failedDispatchesTemp.filter(el => el.status == this.filterStatus);
    }
    console.log(this.filterCategory);

    if (this.filterCategory == 'all') {
      this.failedDispatches = this.failedDispatchesTemp0;
    }
    else {
      this.failedDispatches = this.failedDispatchesTemp0.filter(el => el.vehicleSubCategory == this.filterCategory);
    }

    console.log(this.failedDispatches);
    console.log(this.failedDispatchesTemp);
    // this.rerenderTable();

  }

    getFailedDispatches() {

        console.log(this.from);

        this.spinner.show();

        this.tripService.getFailedDispatches(this.from, this.to).subscribe(data => {
        
        console.log(data);
        this.failedDispatches = data.content;

        data.content1.forEach(element => {
            this.failedDispatches.push(element);
        });

        this.failedDispatches.sort((el1, el2) => {

            if (el1.recordedTime > el2.recordedTime)
            return -1;
            if (el1.recordedTime < el2.recordedTime)
            return 1;

        });
        this.failedDispatchesTemp = this.failedDispatches;
        this.filterFailedDispatches();
        this.rerenderTable();
        //this.spinner.hide();

        }, error => {
        console.log(error);
        this.spinner.hide();
        });
    }

  dd = false;

    getFailedDispatchesPagination() {

        console.log('*********************************************')
        console.log(this.textData)

        this.spinner.show();

        this.tripService.getFailedDispatchesPagination(this.from, this.to, this.pageNo, this.filterStatus, this.filterCategory, this.textData).subscribe(data => {
        
            console.log(data);
            this.failedDispatches = data.content;
            this.total = data.total;
            this.pages = Math.ceil(data.total / 15); 
            

            this.pagination(100, this.pageNo);

            // this.failedDispatchesTemp = this.failedDispatches;
            // this.filterFailedDispatches();
            if (this.failedDispatches.length > 0) {
                this.rerenderTable();
            } else {
                this.spinner.hide();
            }
        

        }, error => {
            console.log(error);
            this.pagination(100, 1);
            this.spinner.hide();
        });
    }

    i = 0;
    x = true;

    rerenderTable(): void {
        if (this.x) {
        this.x = false;

        if (this.i == 0) {
            this.dtTrigger.next();
            this.i++;
            this.spinner.hide();
            this.x = true;
        }
        else {
            console.log('################## rerender ###############');

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear();
            dtInstance.destroy();
            this.dtTrigger.next();
            this.spinner.hide();
            this.x = true;
            });
        }
        }
    }

    redispatch = false;

    edit(failed) {
        console.log(failed);

        if (failed.type == 'passengerTrip') {
        this.dispatch.customerName = failed.passengerDetails.name
        this.dispatch.customerTelephoneNo = failed.passengerDetails.contactNumber
        this.dispatch.dispatcherId = failed.passengerDetails.id;
        }
        else {
        this.redispatch = true;
        this.dispatch.customerName = failed.customerName
        this.dispatch.customerTelephoneNo = failed.customerTelephoneNo
        this.dispatch.customerEmail = failed.email
        this.dispatch.dispatcherId = failed.dispatcherId;
        }

        this.dispatch.noOfPassengers = failed.noOfPassengers
        this.dispatch.pickupLocation.address = failed.pickupLocation.address
        this.dispatch.pickupLocation.latitude = failed.pickupLocation.latitude
        this.dispatch.pickupLocation.longitude = failed.pickupLocation.longitude
        this.dispatch.dropLocations[0].address = failed.dropLocations[0].address
        this.dispatch.dropLocations[0].latitude = failed.dropLocations[0].latitude
        this.dispatch.dropLocations[0].longitude = failed.dropLocations[0].longitude

        this.dispatch.vehicleCategory = failed.vehicleCategory
        this.dispatch.vehicleSubCategory = failed.vehicleSubCategory

        // this.dispatch.hireCost = failed.hireCost
        // this.dispatch.distance = failed.distance

        this.bidValue = failed.bidValue;

        this.dispatch.notes = failed.notes
        this.dispatch.type = failed.type
        this.myLocationAddress = failed.pickupLocation.address
        this.destination1 = failed.dropLocations[0].address
        this.lat[0] = failed.pickupLocation.latitude
        this.lng[0] = failed.pickupLocation.longitude
        this.lat[1] = failed.dropLocations[0].latitude
        this.lng[1] = failed.dropLocations[0].longitude
        this.origin = { lat: this.lat[0], lng: this.lng[0] }
        this.destination = { lat: this.lat[1], lng: this.lng[1] }
        this.getDirection = true;
        this.distanceFormated = failed.distance

        console.warn(this.dispatch);

        this.calculateDistance();
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

    /* author ghost */

    /* author : ghost */
    hideModal():void {
        document.getElementById('close-modal').click();
    }

    openVerticallyCentered(content) {
        this.modalService.open(content, { size: 'lg', centered: true });
    }

    open(content) {
        this.modalService.open(content, { windowClass: 'dark-modal' });
    }
}
