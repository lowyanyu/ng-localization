import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocalizationHttpLoader, NgLocalizationModule, LocalizationLoader } from 'projects/ng-localization/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfoComponent } from './pages/info/info.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new LocalizationHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgLocalizationModule.forRoot({
      loader: {
        provide: LocalizationLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
