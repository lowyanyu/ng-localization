import { Component } from '@angular/core';
import { LocalizationService } from 'projects/ng-localization/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';
  param = { word: 'HI' };
  value = '';
  test = 'special';

  constructor(private translate: LocalizationService) {
    this.translate.setDefaultLang('zh-TW');
  }

  useEnglish() {
    this.translate.use('en');
  }

  useChinese() {
    this.translate.use('zh-TW');
  }

  getKey() {
    this.value = this.translate.get('common.welcome', this.param);
  }
}
