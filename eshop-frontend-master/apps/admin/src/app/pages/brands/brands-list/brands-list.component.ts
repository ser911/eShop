import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Brand, BrandsService } from '@eshop-frontend/categoriesService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, take } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'admin-frontend-brands-list',
  templateUrl: './brands-list.component.html',
  styles: [
  ]
})
export class BrandsListComponent implements OnInit, OnDestroy {

  brands: Brand[];
  endSubs$: Subject<any> = new Subject();

  constructor(private brandsService: BrandsService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this._getBrands()
  }

  ngOnDestroy(): void {
      this.endSubs$.complete();
  }

  private _getBrands(){
    this.brandsService.getBrands().pipe(takeUntil(this.endSubs$)).subscribe(brands =>{
      this.brands = brands;
      console.log(this.brands);
      
    })
  }

  deleteBrand(brandId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Brand?',
      header: 'Delete Brand',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.brandsService.deleteBrand(brandId).subscribe(
          () => {
            this._getBrands();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Brand is deleted!',
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Brand is not deleted!',
            });
          }
        );
      },
    });
  }

  updateBrand(brandId: string){
    this.router.navigateByUrl(`brands/form/${brandId}`)
  }



}
