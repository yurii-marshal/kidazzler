import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ELoginUrls, ILoginType, LoginTypes, ELoginTypeNames } from '../shared/models/login-types';

@Component({
  selector: 'kz-login',
  templateUrl: './login-wrap.component.html',
  styleUrls: ['../public.scss'],
})
export class LoginWrapComponent implements OnInit {
  loginTypeNames = ELoginTypeNames; // to use enum in template
  loginTypeUrls = ELoginUrls; // to use enum in template
  loginTypes: ILoginType[] = LoginTypes;
  currentLoginType: ILoginType = LoginTypes.find(lt => lt.name === 'parent') || LoginTypes[0];

  constructor(private _router: Router) {}

  ngOnInit() {
    this._detectCurrentLoginType();
  }

  private _setCurrentLoginType(url: string) {
    this.currentLoginType = this.loginTypes.find(lt => lt.url === url);
  }

  private _detectCurrentLoginType() {
    const url = this._router.url;
    this._setCurrentLoginType(url);
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this._setCurrentLoginType(e.url);
      }
    });
  }
}
