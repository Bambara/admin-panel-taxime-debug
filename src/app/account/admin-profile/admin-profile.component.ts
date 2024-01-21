import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PendingDriversService} from '../../shared/services/pending-drivers.service';
import {environment} from '../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';
import {SnotifyService} from 'ng-snotify';
import {AdminService} from '../../shared/services/account/admin.service';
import {ActivatedRoute} from '@angular/router';

import Swal from 'sweetalert2/dist/sweetalert2.js';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-profile-admin',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

    currency = environment.CURRENCY;
    COMPANY_CODE = environment.MASTER_COMPANY;
    COMPANY_NAME = environment.MASTER_COMPANY;
    allAdmins: any;
    adminId: any;
    adminDetails: any;
    role: "operation";

    subCategoryData: any;
    vehicleData: any;

    registerForm: FormGroup;
    submitted = false;

    updateForm:FormGroup;
    updated = false;

    adminRoles = [
        { roleId: 1, roleName: 'super' },
        { roleId: 2, roleName: 'manager' },
        { roleId: 3, roleName: 'finance' },
        { roleId: 4, roleName: 'operation' },
        { roleId: 5, roleName: 'dispatcher' },
        { roleId: 6, roleName: 'generic' },
        //{ roleId: 7, roleName: 'agent' },
    ];

    constructor(
        public pendingDriversService: PendingDriversService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private snotifyService: SnotifyService,
        private adminService: AdminService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.adminId = this.route.snapshot.paramMap.get('id');
        this.formData();
        this.updateFormData();
        this.getAdminInfo(this.adminId);
    }

    getAdminInfo(id) {
        this.spinner.show();
        this.adminService.getAdminInfoById(id).
        subscribe((response) => {
            console.log("admin all info");
            console.log(response);

            this.adminDetails = response['content'];

            this.vehicleData = response['content2'];
            this.subCategoryData = response['subCatData'];

            this.spinner.hide();
        }, error => {
            this.adminDetails = null;
            this.spinner.hide();
            console.log("error");
            console.log(error);
            console.log(error.message);
            this.notificationError(error.message);
        });
    }

    // public admin: Admin = {
    //     firstName: null,
    //     lastName: null,
    //     email: null,
    //     nic: null,
    //     birthday: new Date(),
    //     mobile: null,
    //     role: null,
    //     gender: null,
    //     address: null,
    //     street: null,
    //     city: null,
    //     zipcode: null,
    //     country: null,
    //     adminId: null
    // };

    formData() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            nic: ['', Validators.required],
            birthday: ['', Validators.required],
            mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
            role: ['', Validators.required],
            gender: ['', Validators.required],
            address: ['', Validators.required],
            street: ['', Validators.required],
            city: ['', Validators.required],
            zipcode: [''],
            country: [''],
        });
    }

    /* validate form */
    get validate() {
        return this.registerForm.controls;
    }

    onSubmit() {

        console.log(this.registerForm)

        this.submitted = true;

        /* check form validation */
        if (this.registerForm.invalid) {
            this.spinner.hide();
            return;
        }

        /* confirm */
        Swal.fire({
            title: 'New Admin add ?',
            //text: 'You will not be able to recover this file!',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Add',

        }).then((result) => {
            if (result.value) {

                this.spinner.show();

                /* set form data */
                let newAdminFormData = new FormData();

                newAdminFormData.append('firstName', this.registerForm.get('firstName').value);
                newAdminFormData.append('lastName', this.registerForm.get('lastName').value);
                newAdminFormData.append('email', this.registerForm.get('email').value);
                newAdminFormData.append('nic', this.registerForm.get('nic').value);
                newAdminFormData.append('birthday', this.registerForm.get('birthday').value);
                newAdminFormData.append('mobile', this.registerForm.get('mobile').value);
                newAdminFormData.append('role', this.registerForm.get('role').value);
                newAdminFormData.append('gender', this.registerForm.get('gender').value);
                newAdminFormData.append('address', this.registerForm.get('address').value);
                newAdminFormData.append('street', this.registerForm.get('street').value);
                newAdminFormData.append('city', this.registerForm.get('city').value);
                newAdminFormData.append('zipcode', this.registerForm.get('zipcode').value);
                newAdminFormData.append('country', this.registerForm.get('country').value);
                newAdminFormData.append('companyCode', this.COMPANY_CODE);
                newAdminFormData.append('companyName', this.COMPANY_NAME);
                newAdminFormData.append('companyType', "master");
                newAdminFormData.append('password', this.registerForm.get('nic').value);

                /* call API */
                this.adminService.registerAdmin(newAdminFormData)
                .subscribe(data => {
                    this.spinner.hide();
                    this.registerForm.reset();
                    this.submitted = false;

                    this.success(data['message']);

                    /* close modal */
                    this.hideModal();

                    // this.getApprovedVehicles();

                }, error => {
                    // this.error('Error');
                    this.spinner.hide();
                    this.submitted = false;
                    this.error(error['message']);
                    console.log(error);
                });


            } else if (result.dismiss === Swal.DismissReason.cancel) {

                // Swal.fire(
                //     'Cancelled',
                //     'Your imaginary file is safe :)',
                //     'error'
                // )
                // return false;
            }
        })

        // this.adminService.registerAdmin().
        // subscribe((response) => {
        //     this.spinner.hide();
        //     //this.success(response.message);
        //     this.registerForm.reset();
        //     this.submitted = false;

        //     /* close modal */
        //     //this.hideModal();

        //     //this.getApprovedDriversPagination();
        //     //this.hideModel = true;
        // }, error => {
        //     // console.log(error);
        //     this.spinner.hide();
        //     this.notificationError(error.error.details);
        //     this.submitted = false;
        // });

    }

    updateFormData() {
        this.updateForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            nic: ['', Validators.required],
            birthday: ['', Validators.required],
            mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
            role: ['', Validators.required],
            gender: ['', Validators.required],
            address: ['', Validators.required],
            street: ['', Validators.required],
            city: ['', Validators.required],
            zipcode: [''],
            country: [''],
        });
    }

    /* validate form */
    get validateUpdateForm() {
        return this.updateForm.controls;
    }

    updateOnSubmit() {

        console.log(this.updateForm)

        this.updated = true;

        /* check form validation */
        if (this.updateForm.invalid) {
            this.spinner.hide();
            return;
        }

        /* check changers */
        // console.log(this.changersCheck());
        // if (this.changersCheck()) {
        //     this.updated = false;
        //     this.error("No changers");
        // } else {

        /* confirm */
        Swal.fire({
            title: 'Update Admin details ?',
            //text: 'You will not be able to recover this file!',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Update',

        }).then((result) => {
            if (result.value) {

                this.spinner.show();

                /* set form data */
                let updateAdminFormData = new FormData();

                updateAdminFormData.append('firstName', this.updateForm.get('firstName').value);
                updateAdminFormData.append('lastName', this.updateForm.get('lastName').value);
                updateAdminFormData.append('email', this.updateForm.get('email').value);
                updateAdminFormData.append('nic', this.updateForm.get('nic').value);
                    updateAdminFormData.append('birthday', this.updateForm.get('birthday').value);
                    updateAdminFormData.append('mobile', this.updateForm.get('mobile').value);
                    updateAdminFormData.append('role', this.updateForm.get('role').value);
                    updateAdminFormData.append('gender', this.updateForm.get('gender').value);
                    updateAdminFormData.append('address', this.updateForm.get('address').value);
                    updateAdminFormData.append('street', this.updateForm.get('street').value);
                    updateAdminFormData.append('city', this.updateForm.get('city').value);
                    updateAdminFormData.append('zipcode', this.updateForm.get('zipcode').value);
                    updateAdminFormData.append('country', this.updateForm.get('country').value);
                    updateAdminFormData.append('companyCode', this.COMPANY_CODE);
                    updateAdminFormData.append('companyName', this.COMPANY_NAME);
                    updateAdminFormData.append('companyType', "master");

                    updateAdminFormData.append('adminId', this.adminId);

                    /* call API */
                    this.adminService.updateAdmin(updateAdminFormData)
                    .subscribe(data => {
                        this.spinner.hide();
                        this.updated = false;

                        this.success(data['message']);

                        /* close modal */
                        this.hideUpdateModal();

                        this.getAdminInfo(this.adminId);

                    }, error => {
                        // this.error('Error');
                        this.spinner.hide();
                        this.updated = false;
                        this.error(error['message']);
                        console.log(error);
                    });


            } else if (result.dismiss === Swal.DismissReason.cancel) {

                // Swal.fire(
                //     'Cancelled',
                //     'Your imaginary file is safe :)',
                //     'error'
                // )
                // return false;
            }
        })

            // this.adminService.registerAdmin().
            // subscribe((response) => {
            //     this.spinner.hide();
            //     //this.success(response.message);
            //     this.registerForm.reset();
            //     this.submitted = false;

        //     /* close modal */
            //     //this.hideModal();

            //     //this.getApprovedDriversPagination();
            //     //this.hideModel = true;
            // }, error => {
            //     // console.log(error);
            //     this.spinner.hide();
            //     this.notificationError(error.error.details);
            //     this.submitted = false;
            // });
        // }

    }

    /* check changer before update */
    // changersCheck(){
    //     if (
    //         this.adminDetails.firstName === this.updateForm.get('firstName').value &&
    //         this.adminDetails.lastName === this.updateForm.get('lastName').value &&
    //         this.adminDetails.email === this.updateForm.get('email').value &&
    //         this.adminDetails.nic === this.updateForm.get('nic').value &&
    //         this.adminDetails.birthday === this.updateForm.get('birthday').value &&
    //         this.adminDetails.mobile === this.updateForm.get('mobile').value &&
    //         this.adminDetails.role === this.updateForm.get('role').value &&
    //         this.adminDetails.gender === this.updateForm.get('gender').value &&
    //         this.adminDetails.address.address === this.updateForm.get('address').value &&
    //         this.adminDetails.address.street === this.updateForm.get('street').value &&
    //         this.adminDetails.address.city === this.updateForm.get('city').value
    //         //this.adminDetails.address.zipcode === this.updateForm.get('zipcode').value &&
    //         //this.adminDetails.address.country === this.updateForm.get('country').value
    //     ) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    /* get admin list */
    getAdminList(){
        this.spinner.show();
        this.adminService.getAllAdminsData().
        subscribe((response) => {
            console.log("admins");
            console.log(response);

            this.allAdmins = response['content'];

            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            console.log(error);
            this.error(error.error['message']);
        });
    }

    /* close modal */
    hideModal():void {
        document.getElementById('close-modal').click();
    }

    hideUpdateModal():void {
        document.getElementById('close-update-modal').click();
    }


    notificationError(msg) {
        this.snotifyService.error(msg, {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: "rightTop"
        })
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

}
