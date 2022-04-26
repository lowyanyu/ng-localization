import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'projects/ng-localization/src/lib/ng-localization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public translate: LocalizationService) {
    console.log(translate.defaultLang);
  }

  ngOnInit() {
    console.log('honme');
  }

}
