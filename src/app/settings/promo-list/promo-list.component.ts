import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PendingDriversService } from '../../shared/services/pending-drivers.service';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { PromotionService } from '../../shared/services/promotion.service';
import { DataTableDirective } from 'angular-datatables';
import { from, Subject } from 'rxjs';

import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.css']
})
export class PromoListComponent implements OnInit {

    currency = environment.CURRENCY;
    data: any;
    promoId: any;
    promoDetails: any;

    isCollapsed: Boolean[] = [];
    dtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 10,
        order : [0, 'desc']
    };
    
    dtTrigger = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    i = 0;
    rerenderTable(): void {
        if (this.i == 0) {
        this.dtTrigger.next();
        this.i++;
        }
        else {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear();
            dtInstance.destroy();
            this.dtTrigger.next();
        });
        }
    }


  agentId: any;
  agentDetails: any;

  subCategoryData: any;
  vehicleData: any;

  registerForm: FormGroup;
  submitted = false;

  updateForm: FormGroup;
  updated = false;

    constructor(
        public pendingDriversService: PendingDriversService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private snotifyService: SnotifyService,
        private promotionService: PromotionService
    ) {
    }

    ngOnInit() {
        this.formData();
        this.getAllPromotions();
    }

    formData() {
        this.registerForm = this.formBuilder.group({
            ownerFirstName: ['', Validators.required],
            ownerLastName: ['', Validators.required],
            agentEmail: ['', [Validators.required, Validators.email]],
            nic: ['', Validators.required],
            birthday: ['', Validators.required],
            agentContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
            companyCode: ['', Validators.required],
            companyName: ['', Validators.required],
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
      title: 'New Agent add ?',
      //text: 'You will not be able to recover this file!',  
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Add',

    }).then((result) => {
        if (result.value) {

            this.spinner.show();

            /* set form data */
            let newAgentFormData = new FormData();

            newAgentFormData.append('firstName', this.registerForm.get('ownerFirstName').value);
            newAgentFormData.append('lastName', this.registerForm.get('ownerLastName').value);
            newAgentFormData.append('email', this.registerForm.get('agentEmail').value);
            newAgentFormData.append('nic', this.registerForm.get('nic').value);
            newAgentFormData.append('birthday', this.registerForm.get('birthday').value);
            newAgentFormData.append('mobile', this.registerForm.get('agentContactNumber').value);
            
            newAgentFormData.append('role', 'agent');
            
            newAgentFormData.append('gender', this.registerForm.get('gender').value);
            newAgentFormData.append('address', this.registerForm.get('address').value);
            newAgentFormData.append('street', this.registerForm.get('street').value);
            newAgentFormData.append('city', this.registerForm.get('city').value);
            newAgentFormData.append('zipcode', this.registerForm.get('zipcode').value);
            newAgentFormData.append('country', this.registerForm.get('country').value);
            newAgentFormData.append('companyCode', this.registerForm.get('companyCode').value);
            newAgentFormData.append('companyName', this.registerForm.get('companyName').value);
            newAgentFormData.append('companyType', 'agent');
            newAgentFormData.append('password', this.registerForm.get('nic').value);

            /* call API */
            // this.agentService.registerAgent(newAgentFormData)
            // .subscribe(data => {
            //     this.spinner.hide();
            //     this.registerForm.reset();
            //     this.submitted = false;

            //     this.success(data['message']);

            //     // this.getApprovedVehicles();

            // }, error => {
            //     // this.error('Error');
            //     this.spinner.hide();
            //     this.submitted = false;
            //     this.error(error['message'])
            //     console.log(error);
            // });
        } 
    })

  }

  /* validate form */
  get validateUpdateForm() {
    return this.updateForm.controls;
  }

    getAllPromotions() {
        this.spinner.show();

        this.promotionService.getPromotions().subscribe(res => {

            console.log("Promotions");
            console.log(res);
            this.data = res;
            
            this.promoDetails = this.data.content;
            console.log(this.promoDetails);

            this.promoDetails.forEach(element => {
                this.isCollapsed.push(false);
            });

            this.rerenderTable();

            this.spinner.hide();

        }, error => {
            console.log(error);
            this.promoDetails = []

            this.spinner.hide();
        });
    }

    updatePromoId(id) {
        this.promoId = id;
    }
    /* update commission */

    commission = 0;

    updatePromoCommission() {

        if (this.commission <= 0) {
            this.notificationError('Minimum commison percentage 1%');
        } else {

            Swal.fire({  
                title: 'Commison percentage: '+this.commission,  
                //text: 'Recharge Amount: '+this.currency+' '+this.rechargeAmount,  
                icon: 'warning',  
                showCancelButton: true,  
                cancelButtonText: 'Cancel', 
                confirmButtonText: 'Yes, Update', 
                
            }).then((result) => {  
                if (result.value) {

                    this.spinner.show();

                    this.promotionService.updatePromotionCommissionById(this.promoId, this.commission)
                    .subscribe(data => {
                        this.success('success');

                        this.commission = 0;
                        
                        this.hidePromoUpdateModal();

                        this.getAllPromotions();
                        //this.spinner.hide();
                    }, error => {
                        this.spinner.hide();
                        this.notificationError(error.message);
                        //this.error(error['message']);
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
        }

    }

    hidePromoUpdateModal():void {
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