import { NgModule, ModuleWithProviders, Provider } from '@angular/core';

import { LocalizationPipe } from './ng-localization.pipe';
import { LocalizationParser, LocalizationDefaultParser } from './ng-localization.parser';
import { LocalizationHttpLoader } from './ng-localization.loader';
import { MissingTranslationHandler, FakeMissingTranslationHandler } from './ng-localization.missing';
import { LocalizationService, USE_DEFAULT_LANG } from './ng-localization.service';

export interface NgLocalizationConfig {
  loader?: Provider;
  parser?: Provider;
  missingTranslationHandler?: Provider;
  useDefaultLang?: boolean;
}

@NgModule({
  declarations: [LocalizationPipe],
  imports: [],
  exports: [LocalizationPipe]
})
export class NgLocalizationModule {
  static forRoot(config: NgLocalizationConfig = {}): ModuleWithProviders<NgLocalizationModule> {
    return {
      ngModule: NgLocalizationModule,
      providers: [
        config.loader || {provide: LocalizationParser, useClass: LocalizationHttpLoader},
        config.parser || {provide: LocalizationParser, useClass: LocalizationDefaultParser},
        config.missingTranslationHandler || {provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler},
        {provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang},
        LocalizationService
      ]
    };
  }
}
