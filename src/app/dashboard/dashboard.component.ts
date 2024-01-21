import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../shared/services/dashboard.service'
import { environment } from '../../environments/environment';
import { SettingsService } from '../shared/services/settings.service';
import * as io from 'socket.io-client';
import { Role } from '../enums/role.enum';

import Swal from 'sweetalert2/dist/sweetalert2.js'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    // title: string = 'Snap App - Map';
    currency = environment.CURRENCY;
    lng: any = 79.921341;
    lat: any = 6.903585;
    zoom: number = 15;
    place1: Position;
    myLocation1: Position;
    vehicleTrackingData: any;
    vehicleTrackingDataTemp: any;

    today1 = new Date();
    today2 = new Date();

    from;
    to;

    showData = false;

    interval;
    vehicleCategoryData: any = [];
    dashboardData: any;
    adminRole: string = localStorage.getItem('role');
    companyCode: string = localStorage.getItem('companyCode');
    roleEnum = Role;

    private socket;

    constructor(
        public dashboardService: DashboardService,
        public settingsService: SettingsService
    ) {
    }

    ngOnInit() {
        this.setCurrentPosition();
        this.getVehicleTracking();
        this.getVehicleCategoryDetails();

        this.socket = io(environment.ws_url, {
        transports: ['polling']
        });

        this.socket.on('connect', () => {
        localStorage.setItem('socketId', this.socket.id);
        console.log(localStorage.getItem('socketId'));
        });

        this.socketHandle();

        this.today2.setDate(this.today1.getDate() + 1);
        this.from = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + this.today1.getDate();
        this.to = this.today2.getFullYear() + '-' + ((this.today2.getMonth() + 1) > 9 ? '' : '0') + (this.today2.getMonth() + 1) + '-' + (this.today2.getDate() > 9 ? '' : '0') + (this.today2.getDate());
        this.getDashboardData();
        
        /* run the function every 5 seconds */
        this.interval = setInterval(() => {
        // this.getVehicleTracking();
        // this.getDashboardData();
        this.socketHandle();
        // console.log(this.vehicleTrackingDataTemp);
        // this.iterationCategory();
        }, 5000);

        /* run the function getDashboardData every 15 seconds */
        this.interval = setInterval(() => {
            console.log("##### pull dashboard data #####");
            this.getDashboardData();
            this.getVehicleTracking();
        }, 30000);

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
                    height: 25
                }
                }
            }
            else if (element.currentStatus == 'online') {
                element.driverIcon = {
                url: element.vehicleCategoryData.subCategory[0].mapIcon,
                scaledSize: {
                    width: 40,
                    height: 25
                }
                }
            }
            // (element.currentStatus == 'online')
            else {
                element.driverIcon = {
                url: element.vehicleCategoryData.subCategory[0].mapIconOntrip,
                scaledSize: {
                    width: 40,
                    height: 25
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

        // console.error(this.vehicleTrackingDataTemp);
        this.vehicleTrackingData = this.vehicleTrackingDataTemp;
        this.vehicleTrackingDataBackup = this.vehicleTrackingDataTemp;
        this.filterVehicleTracking(this.type);

    }

    iterationCategory1() {
        var temp;
        var tempStatus;

        this.vehicleTrackingData.forEach(element => {
        temp = this.vehicleTrackingDataTemp.filter(el => el.driverId == element.driverId);

        if (temp[0]) {
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

        else {
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
        // console.error(this.vehicleTrackingData);
        // this.vehicleTrackingData = this.vehicleTrackingDataTemp;
        this.vehicleTrackingDataBackup = this.vehicleTrackingData;
        this.filterVehicleTracking(this.type);

    }


    socketHandle() {
        // this.socket.emit('adminConnected', { adminId: localStorage.getItem('userId') })

        this.socket.emit('getOnlineDriversBylocation', { socketId: localStorage.getItem('socketId') })

        this.socket.on('allOnlineDriversResult', (data) => {
        // console.log(data);
        this.vehicleTrackingDataTemp = data;
        this.iterationCategory1();

        });

    }

    getDashboardData() {
        this.dashboardService.getDashboardData(this.from, this.to)
        .subscribe(
            data => {
                console.log("dashboard data");
                console.log(data);
                this.dashboardData = data['content'];
                this.dashboardData['totalIncome'] = this.dashboardData['totalIncome'].toFixed(2);
                this.dashboardData['commissionIncome'] = this.dashboardData['commissionIncome'].toFixed(2);
                this.showData = true;
            },
            error => { }
        )
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    private setCurrentPosition() {
        if (navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            this.lng = +pos.coords.longitude;
            this.lat = +pos.coords.latitude;
            this.zoom = 12;
        });
        }

    }

    getVehicleCategoryDetails() {
        this.settingsService.getEnabledCategory()
        .subscribe(
            data => {
            this.vehicleCategoryData.push({
                name: 'all',
                count: 0
            })
            data.content.forEach(element => {
                element.subCategory.forEach(element => {
                this.vehicleCategoryData.push({
                    name: element.subCategoryName,
                    count: 0
                })
                });
            });

            },
            error => {
            console.log(error);
            }
        );
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
            // console.error(this.vehicleTrackingData);
            this.filterVehicleTracking(this.type);
            },
            error => { }
        )
    }

    refresh() {
        console.log('refresh');
        this.dashboardService.refresh()
        .subscribe(
            data => {
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

    countType2 = [];

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

        this.filterVehicleTracking2(this.type2);
    }

    filterVehicleTracking2(type) {
        this.type2 = type;
        if (this.type2 != 'all') {
        this.vehicleTrackingData = this.vehicleTrackingDataBackup.filter(el => el.vehicleSubCategory == this.type2);
        }

        if(this.vehicleCategoryData[0]) this.vehicleCategoryData[0].count = this.countAll;

        this.vehicleCategoryData.forEach(element => {
        element.count = this.vehicleTrackingDataBackup.filter(el => el.vehicleSubCategory == element.name).length
        });

    }

    simpleAlert(){  
        Swal.fire('Hello Angular');  
    }  



}
