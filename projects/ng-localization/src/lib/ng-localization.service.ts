import { Injectable, EventEmitter, Inject, InjectionToken } from '@angular/core';
import { map, share, take } from 'rxjs/operators';
import { Observable, of, Observer } from 'rxjs';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from './ng-localization.missing';
import { LocalizationParser } from './ng-localization.parser';
import { LocalizationLoader } from './ng-localization.loader';

export const USE_DEFAULT_LANG = new InjectionToken<string>('USE_DEFAULT_LANG');

export interface TranslationChangeEvent {
  translations: any;
  lang: string;
}

export interface LangChangeEvent {
  lang: string;
  translations: any;
}

export interface DefaultLangChangeEvent {
  lang: string;
  translations: any;
}

@Injectable()
export class LocalizationService {
  private loadingTranslations = new Observable<any>();
  private pending = false;
  private sOnTranslationChange: EventEmitter<TranslationChangeEvent> = new EventEmitter<TranslationChangeEvent>();
  private sOnLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();
  private sOnDefaultLangChange: EventEmitter<DefaultLangChangeEvent> = new EventEmitter<DefaultLangChangeEvent>();
  private sDefaultLang: string = '';
  private sCurrentLang: string = '';
  private sLangs: Array<string> = [];
  private sTranslations: any = {};
  private sTranslationRequests: any = {};


  constructor(
    public currentLoader: LocalizationLoader,
    public parser: LocalizationParser,
    public missingTranslationHandler: MissingTranslationHandler,
    @Inject(USE_DEFAULT_LANG) private useDefaultLang: boolean = true,
  ) {}

  get onTranslationChange(): EventEmitter<TranslationChangeEvent> {
    return this.sOnTranslationChange;
  }


  get onLangChange(): EventEmitter<LangChangeEvent> {
    return this.sOnLangChange;
  }


  get onDefaultLangChange() {
    return this.sOnDefaultLangChange;
  }


  set defaultLang(defaultLang: string) {
    this.sDefaultLang = defaultLang;
  }
  get defaultLang(): string {
    return this.sDefaultLang;
  }

  set currentLang(currentLang: string) {
    this.sCurrentLang = currentLang;
  }
  get currentLang(): string {
    return this.sCurrentLang;
  }


  set langs(langs: string[]) {
    this.sLangs = langs;
  }
  get langs(): string[] {
    return this.sLangs;
  }

  set translations(translations: any) {
    this.sTranslations = translations;
  }
  get translations(): any {
    return this.sTranslations;
  }


  public setDefaultLang(lang: string): void {
    if (lang === this.defaultLang) {
      return;
    }

    const pending: Observable<any> | undefined = this.retrieveTranslations(lang);

    if (typeof pending !== 'undefined') {

      if (!this.defaultLang) {
        this.defaultLang = lang;
      }
      pending.pipe(
        take(1)
      ).subscribe(
        () => {
          this.defaultLang = lang;
          this.onDefaultLangChange.emit({lang: lang, translations: this.translations[lang]});
        });
    } else { // we already have this language
      this.defaultLang = lang;
      this.onDefaultLangChange.emit({lang: lang, translations: this.translations[lang]});
    }
  }
  public getDefaultLang(): string {
    return this.defaultLang;
  }

  public use(lang: string): Observable<any> {

    if (lang === this.currentLang) {
      return of(this.translations[lang]);
    }

    const pending: Observable<any> | undefined = this.retrieveTranslations(lang);
    if (typeof pending !== 'undefined') {

      if (!this.currentLang) {
        this.currentLang = lang;
      }

      pending.pipe(
        take(1))
        .subscribe(
          () => {
          this.changeLang(lang);
        });

      return pending;
    } else {
      this.changeLang(lang);

      return of(this.translations[lang]);
    }
  }

  private retrieveTranslations(lang: string): Observable<any> | undefined {
    let pending: Observable<any> | undefined;
    if (typeof this.translations[lang] === 'undefined') {
      this.sTranslationRequests[lang] = this.sTranslationRequests[lang] || this.getTranslation(lang);
      pending = this.sTranslationRequests[lang];
    }

    return pending;
  }

  public getTranslation(lang: string): Observable<any> {
    this.pending = true;
    const loadingTranslations = this.currentLoader.getTranslation(lang).pipe(share());
    this.loadingTranslations = loadingTranslations.pipe(
      take(1),
      map((res: object) => res),
      share()
    );

    this.loadingTranslations
      .subscribe((res: object) => {
        this.translations[lang] = res;
        this.updateLangs();
        this.pending = false;
      }, (err: any) => {
        this.pending = false;
      });

    return loadingTranslations;
  }


  public getLangs(): Array<string> {
    return this.langs;
  }
  public addLangs(langs: Array<string>): void {
    langs.forEach((lang: string) => {
      if (this.langs.indexOf(lang) === -1) {
        this.langs.push(lang);
      }
    });
  }

  private updateLangs(): void {
    this.addLangs(Object.keys(this.translations));
  }

  public getParsedResult(translations: any, key: any, interpolateParams?: object): any {
    let res: string | Observable<string> | undefined;

    if (translations) {
      res = this.parser.interpolate(this.parser.getValue(translations, key), interpolateParams);
    }

    if (typeof res === 'undefined' && this.defaultLang && this.defaultLang !== this.currentLang && this.useDefaultLang) {
      res = this.parser.interpolate(this.parser.getValue(this.translations[this.defaultLang], key), interpolateParams);
    }

    if (typeof res === 'undefined') {
      const params: MissingTranslationHandlerParams = {key, translateService: this};
      if (typeof interpolateParams !== 'undefined') {
        params.interpolateParams = interpolateParams;
      }
      res = this.missingTranslationHandler.handle(params);
    }

    return typeof res !== 'undefined' ? res : key;
  }


  public getTranslateResult(key: string, interpolateParams?: object): Observable<string | any> {
    if ((!key && key === undefined) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    // check if loading a new translation to use
    if (this.pending) {
      return Observable.create((observer: Observer<string>) => {
        const onComplete = (res: string) => {
          observer.next(res);
          observer.complete();
        };
        const onError = (err: any) => {
          observer.error(err);
        };
        this.loadingTranslations.subscribe((res: any) => {
          res = this.getParsedResult(res, key, interpolateParams);
          if (typeof res.subscribe === 'undefined') {
            onComplete(res);
          } else {
            res.subscribe(onComplete, onError);
          }
        }, onError);
      });
    } else {
      const res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
      if (typeof res.subscribe === 'undefined') {
        return of(res);
      } else {
        return res;
      }
    }
  }

  public get(key: string, interpolateParams?: object): string | any {
    if ((!key && key === undefined) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    const res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
    return res;
  }

  public set(key: string, value: string, lang: string = this.currentLang): void {
    this.translations[lang][key] = value;
    this.updateLangs();
    this.onTranslationChange.emit({lang: lang, translations: this.translations[lang]});
  }

  private changeLang(lang: string): void {
    this.currentLang = lang;
    this.onLangChange.emit({ lang: lang, translations: this.translations[lang]});

    if (!this.defaultLang) {
      this.defaultLang = lang;
      this.onDefaultLangChange.emit({ lang: lang, translations: this.translations[lang]});
    }
  }

}
