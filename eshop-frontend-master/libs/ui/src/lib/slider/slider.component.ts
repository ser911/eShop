import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Brand, BrandsService } from '@eshop-frontend/categoriesService';

@Component({
  selector: 'ui-slider',
  templateUrl: './slider.component.html',

})
export class SliderComponent implements OnInit {
brands: Brand[] = []  
idS: any[] = [];
brandId: string;
responsiveOptions;

  constructor(private brandsService: BrandsService,
              private router: Router,
              ) {
                       this.responsiveOptions = [
                         {
                           breakpoint: '1024px',
                           numVisible: 3,
                           numScroll: 3,
                         },
                         {
                           breakpoint: '768px',
                           numVisible: 2,
                           numScroll: 2,
                         },
                         {
                           breakpoint: '560px',
                           numVisible: 1,
                           numScroll: 1,
                         },
                       ]; 
              }

  ngOnInit(): void {
    this.brandsService.getBrands().subscribe((brands)=>{
      this.brands = brands;
    this.brands.forEach(element =>this.idS.push(element.id)
    );
       
   })

  }



 navigateToBrand(brandId, brandName: string){
  this.router.navigate([`/products/brand/${brandId}/${brandName}`]);      
  }

}
