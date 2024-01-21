import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PendingDriversService } from '../../shared/services/pending-drivers.service';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { AgentService } from '../../shared/services/agent.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-agent-registration',
  templateUrl: './agent-registration.component.html',
  styleUrls: ['./agent-registration.component.css']
})
export class AgentRegistrationComponent implements OnInit {

  currency = environment.CURRENCY;
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
    private agentService: AgentService
  ) {
  }

  ngOnInit() {
    this.formData();
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
        this.agentService.registerAgent(newAgentFormData)
          .subscribe(data => {
            this.spinner.hide();
            this.registerForm.reset();
            this.submitted = false;

            this.success(data['message']);

            // this.getApprovedVehicles();

          }, error => {
            // this.error('Error');
            this.spinner.hide();
            this.submitted = false;
            this.error(error['message'])
            console.log(error);
          });
      } 
    })

  }

  /* validate form */
  get validateUpdateForm() {
    return this.updateForm.controls;
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