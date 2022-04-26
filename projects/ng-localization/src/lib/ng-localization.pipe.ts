import { Pipe, PipeTransform, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LangChangeEvent, DefaultLangChangeEvent, LocalizationService, TranslationChangeEvent } from './ng-localization.service';


@Pipe({
  name: 'translate',
  pure: false
})
export class LocalizationPipe implements PipeTransform, OnDestroy {

  value = '';
  lastKey: string | any;
  lastParams: any[] = [];
  onTranslationChange: EventEmitter<TranslationChangeEvent> | undefined;
  onLangChange: EventEmitter<LangChangeEvent> | undefined;
  onDefaultLangChange: EventEmitter<DefaultLangChangeEvent> | undefined;

  constructor(private translate: LocalizationService, private _ref: ChangeDetectorRef) {
  }

  transform(query: string, ...args: any[]): any {
    // console.log('TransForm Pipe Query : ' + query);
    // console.log('TransForm Pipe Args : ' + args);
    if (!query || query.length === 0) {
      return query;
    }

    if ((query === this.lastKey) && (args === this.lastParams)) {
      return this.value;
    }

    let interpolateParams: object | undefined;
    if (args.length && args[0] !== undefined) {
      if (typeof args[0] === 'string' && args[0].length) {
        // we accept objects written in the template such as {n:1}, {'n':1}, {n:'v'}
        // which is why we might need to change it to real JSON objects such as {"n":1} or {"n":"v"}
        const  validArgs: string = args[0]
          .replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
          .replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
        try {
          interpolateParams = JSON.parse(validArgs);
        } catch (e) {
          throw new SyntaxError(`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`);
        }
      } else if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
        interpolateParams = args[0];
      }
    }

    this.lastKey = query;

    this.lastParams = args;

    this.updateValue(query, interpolateParams);

    this._dispose();

    if (!this.onTranslationChange) {
      this.translate.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
        if (this.lastKey && event.lang === this.translate.currentLang) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }

    if (!this.onLangChange) {
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        if (this.lastKey) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }

    if (!this.onDefaultLangChange) {
      this.translate.onDefaultLangChange.subscribe(() => {
        if (this.lastKey) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams);
        }
      });
    }

    return this.value;
  }

  updateValue(key: string, interpolateParams?: object, translations?: any): void {
    const onTranslation = (res: string) => {
      this.value = res !== undefined ? res : key;
      this.lastKey = key;
      this._ref.markForCheck();
    };

    if (translations) {
      const res = this.translate.getParsedResult(translations, key, interpolateParams);
      if (typeof res.subscribe === 'undefined') {
        onTranslation(res);
      }
    }
    this.translate.getTranslateResult(key, interpolateParams).subscribe(onTranslation);
  }


  private _dispose(): void {
    if (typeof this.onTranslationChange !== 'undefined') {
      this.onTranslationChange.unsubscribe();
      this.onTranslationChange = undefined;
    }
    if (typeof this.onLangChange !== 'undefined') {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
    if (typeof this.onDefaultLangChange !== 'undefined') {
      this.onDefaultLangChange.unsubscribe();
      this.onDefaultLangChange = undefined;
    }
  }

  ngOnDestroy(): void {
    this._dispose();
  }

}
