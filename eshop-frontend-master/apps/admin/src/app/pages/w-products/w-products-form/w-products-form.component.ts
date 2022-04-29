import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CategoriesService,
  Category,
  W_ProductsService,
  W_Product,
  BrandsService,
  Brand,
} from '@eshop-frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'eshop-frontend-w-products-form',
  templateUrl: './w-products-form.component.html',
  styles: [],
})
export class WProductsFormComponent implements OnInit {
  editmode = false;
  form: FormGroup;
  isSubmitted = false;
  categories: Category[];
  brands: Brand[];
  imageDisplay: string | ArrayBuffer | null | undefined;
  galleryFiles: any[] = [];
  currentProductId: string;
  sex: [{ sex: 'M' }, { sex: 'F' }];

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private W_productsService: W_ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
this._getCategories();
  this._getBrands();
  this.initForm();
  this._checkEditMode();

  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      sex: ['', Validators.required],
      image: [''],
      images: [''],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      isFeatured: [false],
      rating: [''],
      color: [''],
      discount: [0],
      factoryCode: [''],
    });
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(this.categories);
    });
  }

  private _getBrands() {
    this.brandsService.getBrands().subscribe((brands) => {
      this.brands = brands;
      console.log(this.brands);
    });
  }

  back() {
    this.location.back();
  }

  private _addProduct(productData: FormData) {
    this.W_productsService.createProduct(productData).subscribe(
      (product: W_Product) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product ${product.name} is created!`,
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
          detail: 'Product was not created!',
        });
      }
    );
  }
  private _updateProduct(productFormData: FormData) {
    this.W_productsService
      .updateWProduct(productFormData, this.currentProductId)
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product is updated!',
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
            detail: 'Product is not updated!',
          });
        }
      );
  }
  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentProductId = params.id;
        this.W_productsService.getWProduct(params.id).subscribe((product) => {
          this.productForm.name.setValue(product.name);
          this.productForm.brand.setValue(product.brand);
          this.productForm.price.setValue(product.price);
          this.productForm.sex.setValue(product.sex);
          this.productForm.category.setValue(product.category);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.description.setValue(product.description);
          this.productForm.image.setValue(product.image);
          this.productForm.rating.setValue(product.rating);
          this.productForm.color.setValue(product.color);
          this.productForm.discount.setValue(product.discount);
          this.productForm.factoryCode.setValue(product.factoryCode);
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
          this.galleryFiles = product.images;
          this.productForm.images.setValidators([]);
          this.productForm.images.updateValueAndValidity();
        });
      }
    });
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });
    if (this.editmode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
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

  get productForm() {
    return this.form.controls;
  }
}
