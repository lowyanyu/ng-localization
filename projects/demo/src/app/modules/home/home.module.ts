import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgLocalizationModule } from 'projects/ng-localization/src/public-api';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgLocalizationModule
  ]
})
export class HomeModule { }
