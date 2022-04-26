import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export abstract class LocalizationLoader {
  abstract getTranslation(lang: string): Observable<any>;
}

@Injectable()
export class LocalizationHttpLoader implements LocalizationLoader {

  public prefix: string;
  public suffix: string;

  constructor(private http: HttpClient) {
    this.prefix= './assets/i18n/';
    this.suffix = '.json';
  }

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<object> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}
