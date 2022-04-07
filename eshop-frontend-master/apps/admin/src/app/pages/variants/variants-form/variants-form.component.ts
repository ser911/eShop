import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, ProductsService, Product, VariantsService, Variant } from '@eshop-frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';


@Component({
  selector: 'admin-frontend-variants-form',
  templateUrl: './variants-form.component.html',
  styles: [
  ]
})
export class VariantsFormComponent implements OnInit {
  form: FormGroup;
  currentId;
  isSubmitted = false;
  imageDisplay: string | ArrayBuffer | null | undefined;
  galleryFiles: any[] = [];


  constructor(private formBuilder: FormBuilder,
    private variantsService: VariantsService,
    private productsService: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._retrieveId();
    this.initForm();
    
  }

  private _retrieveId(){
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.currentId = params.id;
        console.log(this.currentId);        
      }
    })
  }


  private initForm() {
    this.form = this.formBuilder.group({
      product: ['', Validators.required],
      size: ['', Validators.required],
      inventory: ['', Validators.required],
      barcode: ['', Validators.required]

    });
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid) return;
    const variantFormData = new FormData();
    Object.keys(this.variantForm).map((key) =>{
      variantFormData.append(key, this.variantForm[key].value)
    });
    this._addVariant(variantFormData);    
  }

  private _addVariant(variantData: FormData) {
    this.variantsService.createVariant(variantData).subscribe(
      (variant: Variant) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Size is created!',
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
          detail: 'Size was not created!',
        });
      }
    );
  }


  back(){
    this.location.back(); 
  }
  
get variantForm(){
  return this.form.controls;
}


}
