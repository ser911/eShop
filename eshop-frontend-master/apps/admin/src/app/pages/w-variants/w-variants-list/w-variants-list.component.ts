import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { W_Product } from '@eshop-frontend/categoriesService';
import { W_Variant } from '@eshop-frontend/categoriesService';
import { W_VariantsService } from '@eshop-frontend/categoriesService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { W_ProductsService } from '@eshop-frontend/categoriesService';

@Component({
  selector: 'eshop-frontend-w-variants-list',
  templateUrl: './w-variants-list.component.html',
  styles: [],
})
export class WVariantsListComponent implements OnInit {
  variants: W_Variant[] = [];
  prodVariants = [];
  form: FormGroup;
  currentId: string;
  notSpecificId = false;
  endsubs$: Subject<any> = new Subject();
  products;

  constructor(
    private variantsService: W_VariantsService,
    private productService: W_ProductsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this._retrieveId();
    this._getProdVariants();
  }

  private _retrieveId() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentId = params.id;
        console.log(this.currentId);
      }
    });
  }

  private _getProdVariants() {
    this.variantsService
      .getProdW_Variants(this.currentId)
      .pipe(takeUntil(this.endsubs$))
      .subscribe((variants) => {
        this.variants = variants;
        console.log(this.variants);
      });
  }

  deleteVariant(variantId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this size?',
      header: 'Delete Variant',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.variantsService
          .deleteW_Variant(variantId)
          .pipe(takeUntil(this.endsubs$))
          .subscribe(
            () => {
              this._getProdVariants();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'size is deleted!',
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'size is not deleted!',
              });
            }
          );
      },
    });
  }

  navigateToVariant(variantId: string) {
    this.router.navigateByUrl(`variants/women-product/${variantId}/form/edit`);
  }

  back() {
    this.location.back();
  }
}
