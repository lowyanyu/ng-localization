import { Injectable } from '@angular/core';
import { LocalizationService } from './ng-localization.service';


export interface MissingTranslationHandlerParams {
  key: string;
  translateService: LocalizationService;
  interpolateParams?: object;
}

export abstract class MissingTranslationHandler {
  abstract handle(params: MissingTranslationHandlerParams): any;
}

@Injectable()
export class FakeMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    return params.key;
  }
}
