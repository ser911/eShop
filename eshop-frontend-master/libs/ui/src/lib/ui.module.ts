import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { SliderComponent } from './slider/slider.component';
import { ButtonModule } from 'primeng/button';
import { GalleryComponent } from './components/gallery/gallery.component';
import {CarouselModule} from 'primeng/carousel';


@NgModule({
    imports: [CommonModule, ButtonModule, CarouselModule],
    declarations: [
      BannerComponent,
      SliderComponent,
      GalleryComponent
    ],
    exports: [
      BannerComponent,
      SliderComponent,
      GalleryComponent
    ]
})
export class UiModule {};