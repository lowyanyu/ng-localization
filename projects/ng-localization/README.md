# NgLocalization

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Usage

1. Import the `NgLocalizationModule`: 

  You have to import `NgLocalizationModule.forRoot()` in the root NgModule of your application and delcare `HttpLoaderFactory` to `new LocalizationHttpLoader`.

  The `forRoot` static method is a convention that provides and configures services at the same time. Make sure you only call this method in the root module of your application, most of the time called `AppModule`. This method allows you to configure the `NgLocalizationModule` by specifying a loader, a parser and/or a missing translations handler.

  ```ts
    export function HttpLoaderFactory(httpClient: HttpClient) {
      return new LocalizationHttpLoader(httpClient);
    }

    @NgModule({
      declarations: [
        AppComponent,
        InfoComponent,

      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        NgLocalizationModule.forRoot({
          loader: {
            provide: LocalizationLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
  ```

2. Define customer translations.

  You can put your translations in a json file that will be imported with the `LocalizationHttpLoader`. It will load translations from `/assets/i18n/[lang].json`. This is a following json file: 

  `/assets/i18n/zh-Tw.json`
  ```json
    {
      "common": {
        "projectname": "測試",
        "welcome" : "{{word}}"
      },
      "special": "測試看看"
    }
  ```

3. Init the `LocalizationService` for your application:

  You need to initialization `LocalizationService` in your `app.component` and set default language.

  ```ts
    constructor(
      private translate: LocalizationService
    ) {
      this.translate.setDefaultLang('zh-TW');
    }
  ```

4.  Use the service - Pipe:

  You can use `translations` with the pipe : 

  ```ts
    {{ 'common.projectname' | translate }}


    ### app.component.html ###
    {{ 'common.welcome' | translate:param }}
    // ouptut : Hi 

    ### app.component.ts ###
    param = { word: 'HI' };


    ### app.component.html ###
    {{ test | translate }}
    // ouptut : 測試看看 

    ### app.component.ts ###
    test = 'special';


    ### app.component.html ###
    <div>{{value}}</div>
    // ouptut : Hi

    ### app.component.ts ###
    const res  = this.translate.get('common.welcome', this.param);
  ```

## Code scaffolding

Run `ng generate component component-name --project ng-localization` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ng-localization`.
> Note: Don't forget to add `--project ng-localization` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ng-localization` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

1.  修改 `ng-localization\projects\ng-localization\package.json` 中的版本號 `version`(下一個版本號，給使用lib的人看的) 
2.  執行指令，npm給project下版本號並壓上tag  
```sh
$ npm version [major|minor|patch]
```
3.  包版
```sh
$ npm run package
```
4.  發佈
```sh
$ npm publish dist/ng-localization
```

## Running unit tests

Run `ng test ng-localization` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
