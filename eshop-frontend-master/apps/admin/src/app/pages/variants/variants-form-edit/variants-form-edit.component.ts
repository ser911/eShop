import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, ProductsService, Product, VariantsService } from '@eshop-frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';




@Component({
  selector: 'admin-frontend-variants-form-edit',
  templateUrl: './variants-form-edit.component.html',
  styles: [
  ]
})
export class VariantsFormEditComponent implements OnInit {
  form: FormGroup;
  currentId: string;
  isSubmitted = false;



  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private productsService: ProductsService,
              private variantsService: VariantsService,
              private messageService: MessageService,
              private location: Location,
              ) {}

  ngOnInit(): void {
   this.initForm();
  this._retrieveId();
  this._editMode();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      product: ['', Validators.required],
      size: ['', Validators.required],
      inventory: ['', Validators.required],
      available: ['', Validators.required],
      barcode: ['', Validators.required]
    });
  }


  private _retrieveId(){
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.currentId = params.id;
        
      }
    })
  }

  private _editMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentId = params.id;
        this.variantsService.getVariant(params.id).subscribe((variant) => {
          this.variantForm.product.setValue(variant.product);
          this.variantForm.size.setValue(variant.size);
          this.variantForm.inventory.setValue(variant.inventory);
          this.variantForm.barcode.setValue(variant.barcode);
          this.variantForm.available.setValue(variant.available);        
        });
      }
    });
  }

  
  // onImageUpload(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.form.patchValue({ image: file });
  //     this.form.get('image')?.updateValueAndValidity();
  //     const fileReader = new FileReader();
  //     fileReader.onload = () => {
  //       this.imageDisplay = fileReader.result;
  //     };
  //     fileReader.readAsDataURL(file);
  //   }
  // }

  private _updateVariant(variantFormData: FormData) {
    this.variantsService.updateVariant(variantFormData, this.currentId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Variant is updated!'
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
          detail: 'Variant is not updated!'
        });
      }
    );
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid) return;

    const variantFormData = new FormData();
    Object.keys(this.variantForm).map((key)=>{
      variantFormData.append(key, this.variantForm[key].value)
    });
    this._updateVariant(variantFormData);
  }

  back(){
    this.location.back();
  }

  get variantForm() {
    return this.form.controls;
  }


}

