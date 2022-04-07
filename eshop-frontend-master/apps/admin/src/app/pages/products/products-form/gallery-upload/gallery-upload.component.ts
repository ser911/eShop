import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product } from '@eshop-frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';



@Component({
  selector: 'admin-frontend-gallery-upload',
  templateUrl: './gallery-upload.component.html',
  styles: [
  ]
})
export class GalleryUploadComponent implements OnInit {
  form: FormGroup;
  galleryFiles: any[] = [];
  currentId: string;

  constructor(private formBuilder: FormBuilder,
              private location: Location,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private messageService: MessageService) {}

  ngOnInit(): void {
    this._retrieveId();
    this._initForm();
  }


  private _initForm() {
    this.form = this.formBuilder.group({
      images: ['']
    });
  }

  private _retrieveId(){
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.currentId = params.id;
       
      }
    })
  }

  
  onGalleryUpload(event){
    if (event.target.files){
      const amount = event.target.files.length;
      for (let i = 0; i < amount; i++) {
      const reader = new FileReader();

      reader.onload = (event: any) =>{
        console.log(event.target.result);
        this.galleryFiles.push(event.target.result);

        this.form.patchValue({images: this.galleryFiles});
        this.form.get('images')?.updateValueAndValidity();

        
      }
      reader.readAsDataURL(event.target.files[i])
        
      }
    }
  }

  onSubmit(){
    if (this.form.invalid) return;
    const galleryFormData = new FormData();
    Object.keys(this.productForm).map((key)=>{
      galleryFormData.append(key, this.productForm[key].value)
    });

    this.productsService.addGallery(this.currentId, galleryFormData).subscribe(
      (product: Product)=>{
      this.messageService.add({
        severity: 'Success',
        summary: 'Success',
        detail: `Product ${product.name} is updated`
      });
    },
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'error',
        detail: 'Product was not updated!'
      });
    }
    );
  }

  get productForm() {
    return this.form.controls;
  }

  back(){
    this.location.back(); 
  }


}
