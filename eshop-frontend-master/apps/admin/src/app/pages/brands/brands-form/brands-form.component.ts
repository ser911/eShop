import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BrandsService, Brand } from '@eshop-frontend/products';
import { MessageService } from 'primeng/api';
import { Subject,timer } from 'rxjs';



@Component({
  selector: 'admin-brands-form',
  templateUrl: './brands-form.component.html',
  styles: [],
})
export class BrandsFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSubmitted = false;
  editmode = false;
  brands: Brand[];
  currentBrandId: string;
  imageDisplay: any;
  endsubs$: Subject<any> = new Subject();


  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private brandsService: BrandsService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._checkEditMode();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      image: [''],
      m: [''],
      w: ['']
    });
  }


  onBack(){
    this.location.back();
  }

  ngOnDestroy() {
    this.endsubs$.complete();
  }

  
  private _addBrand(brandFormData: FormData) {
    this.brandsService.createBrand(brandFormData).subscribe(
      (brand: Brand) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Brand ${brand.name} is created!`,
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Brand is not created!',
        });
      }
    );
  }

  private _updateBrand(brandFormData: FormData) {
    // @ts-ignore 
    this.brandsService.updateBrand(brandFormData, this.currentBrandId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Brand is updated!',
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Brand is not updated!',
        });
      }
    );
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentBrandId = params.id;
        this.brandsService.getBrand(params.id).subscribe((brand) => {
          this.brandForm.name.setValue(brand.name);
          this.imageDisplay = brand.image;
          this.brandForm.image.setValue(brand.image);
          this.brandForm.m.setValue(brand.m);
          this.brandForm.w.setValue(brand.w);        
        });
      }
    });
    
  }

  
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const brandFormData = new FormData();
    Object.keys(this.brandForm).map((key) => {
      brandFormData.append(key, this.brandForm[key].value);
    });
    if (this.editmode) {
      this._updateBrand(brandFormData);
    } else {
      this._addBrand(brandFormData);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    }
  }



  get brandForm() {
    return this.form.controls;
  }
}
