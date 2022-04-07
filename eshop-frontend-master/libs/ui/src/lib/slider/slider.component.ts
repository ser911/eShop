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

  constructor(private brandsService: BrandsService,
              private router: Router,
              ) {}

  ngOnInit(): void {
    this.brandsService.getBrands().subscribe((brands)=>{
      this.brands = brands;
    this.brands.forEach(element =>this.idS.push(element.id)
    );
       
   })

  }



 navigateToBrand(brandId){
  this.router.navigate([`/products/brand/${brandId}`]);      
  }

}
