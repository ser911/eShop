import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { Product, Variant } from '@eshop-frontend/categoriesService';
import { VariantsService } from '@eshop-frontend/categoriesService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '@eshop-frontend/categoriesService';



@Component({
  selector: 'admin-frontend-variants-list',
  templateUrl: './variants-list.component.html',
  styles: [
  ]
})
export class VariantsListComponent implements OnInit, OnDestroy {
  variants: Variant[] = [];
  prodVariants = [];
  form: FormGroup;
  currentId: string;
  notSpecificId = false;
  endsubs$: Subject<any> = new Subject();
  products;

  constructor(private variantsService: VariantsService,
              private productService: ProductsService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this._retrieveId();
    this._getProdVariants();

  }

  ngOnDestroy(): void {
      this.endsubs$.complete();
  }


  private _retrieveId(){
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.currentId = params.id;
        console.log(this.currentId);        
      }
    })
  }

  
  private _getProdVariants(){
    this.variantsService.getProdVariants(this.currentId).pipe(takeUntil(this.endsubs$)).subscribe(variants=>{
      this.variants = variants;
      console.log(this.variants);
      
    });
  }

  deleteVariant(variantId: string){
    this.confirmationService.confirm({
      message: 'Do you want to delete this size?',
      header: 'Delete Variant',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.variantsService.deleteVariant(variantId).pipe(takeUntil(this.endsubs$)).subscribe(
          () => {
            this._getProdVariants();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'size is deleted!'
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'size is not deleted!'
            });
          }
        );
      }
    });
  }

  navigateToVariant(variantId: string){
    this.router.navigateByUrl(`variants/product/${variantId}/form/edit`)
    }
  

  back(){
    this.location.back(); 
  }


}
