import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Product, ProductsService, } from '@eshop-frontend/categoriesService';

@Component({
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: [
  ]
})
export class GalleryComponent implements OnInit {
  currentId: string;
  selectedImageUrl: string;
  @Input() product: Product;
  @Input() image: string;
  @Input() images: string[];

  constructor(private productsService: ProductsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productsService.getProduct(this.currentId);  
    this.selectedImageUrl = this.product.image;
    this.images.push(this.image);   
    this._retrieveId();

  }

  private _retrieveId(){
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.currentId = params.id;
        console.log(this.currentId);      
        console.log("x");
          
      }
    })
  }


  changeSelectedImage(imageUrl: string){
    this.selectedImageUrl = imageUrl;
  }

  get hasImages() {
    return this.images?.length > 0;
  }

}
