import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { W_ProductsService, W_VariantsService } from '@eshop-frontend/categoriesService';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'eshop-frontend-w-variants-form-edit',
  templateUrl: './w-variants-form-edit.component.html',
  styles: [],
})
export class WVariantsFormEditComponent implements OnInit {
  form: FormGroup;
  currentId: string;
  isSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productsService: W_ProductsService,
    private variantsService: W_VariantsService,
    private messageService: MessageService,
    private location: Location
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

  private _retrieveId() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentId = params.id;
      }
    });
  }

  private _editMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.currentId = params.id;
        this.variantsService.getW_Variant(params.id).subscribe((variant) => {
          this.variantForm.product.setValue(variant.product);
          this.variantForm.size.setValue(variant.size);
          this.variantForm.inventory.setValue(variant.inventory);
          this.variantForm.barcode.setValue(variant.barcode);
          this.variantForm.available.setValue(variant.available);
        });
      }
    });
  }
  private _updateVariant(variantFormData: FormData) {
    this.variantsService
      .updateW_Variant(variantFormData, this.currentId)
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Variant is updated!',
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
            detail: 'Variant is not updated!',
          });
        }
      );
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    const variantFormData = new FormData();
    Object.keys(this.variantForm).map((key) => {
      variantFormData.append(key, this.variantForm[key].value);
    });
    this._updateVariant(variantFormData);
  }

  back() {
    this.location.back();
  }

  get variantForm() {
    return this.form.controls;
  }
}
