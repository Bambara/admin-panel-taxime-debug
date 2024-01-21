import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CorporateUser } from '../../shared/model/cooparate-users/Users'
import { from, Subject } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { CooparateUsersService } from '../../shared/services/cooparate-users.service';
import { environment } from '../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-cooparate-users',
  templateUrl: './cooparate-users.component.html',
  styleUrls: ['./cooparate-users.component.css']
})
export class CooparateUsersComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  corporateUsers: any;

  uri = environment.apiBase;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private snotifyService: SnotifyService,
    private corporateService: CooparateUsersService
  ) { }

  ngOnInit() {
    this.formData();
    this.getCorporateUsers();
  }


  getCorporateUsers(){
    this.corporateService.getCorporateUsers()
        .subscribe(
          data => {
            this.corporateUsers = data['content']
            this.rerenderTable();
          }
          , error => {
            // this.error(error.message)
          }
        );
  }

  public corporateUser: CorporateUser = {
    companyName: null,
    firstName: null,
    lastName: null,
    mobile: null,
    email: null,
    password: null,
    gender: null,
    address: null,
    street: null,
    city: null,
    zipcode: null,
    country: null,
    companyPic: null,
    isEnable: null,
    isApproved: null,
    employeeStrength: null
  };

  public companyPic = "";
  imageCompany: string | ArrayBuffer;

  birthday;
  lifeInsuranceExpiryDate;

  formData() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      comName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: [''],
      country: [''],
      companyPic: ['', Validators.required],
      isEnable: [''],
      isApproved: [''],
      isVerified: ['']
    });
  }

  companyPicture(event) {

    if (event.target.files && event.target.files[0]) {
      // this.vehicleCategoryVM.formegory[0].formegoryIconSelected = event.target.files[0];
      const file = event.target.files[0];
      this.corporateUser.companyPic = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageCompany = reader.result;

      reader.readAsDataURL(file);
    }
  }

  enable(checked) {
    console.log('Is Enable')
  }

  approved(checked) {
    console.log('Is Approved')
  }

  verified(checked) {
    console.log('Is Verfied')
  }

  get validate() {
    return this.registerForm.controls;
  }

  onSubmit() {
    console.error(this.corporateUser);
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    else {
      this.corporateService.addCorporateUser(this.corporateUser)
        .subscribe(
          data => {
            console.log(data);
            this.success(data.details)
            // this.clearForm();
            this.registerForm.reset();
            this.submitted = false;
            this.getCorporateUsers();
          }
          , error => {
            this.error(error.details)
          }
        );
    }

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

  
dtOptions: DataTables.Settings =  {
    pagingType: 'full_numbers',
    pageLength: 5
  };
dtTrigger = new Subject();
@ViewChild(DataTableDirective) dtElement: DataTableDirective;



i = 0;
rerenderTable(): void {
    if(this.i == 0) {
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
}