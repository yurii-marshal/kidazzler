import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DialogModule } from 'primeng/primeng';

import { InfoMessageComponent } from './info-message/info-message.component';
import { LoaderComponent } from './loader/loader.component';
import { PageBaseInfoPageComponent } from './page-base-info-page/page-base-info-page.component';
import { MarkupRoutingModule } from './markup-routing.module';

@NgModule({
  declarations: [InfoMessageComponent, LoaderComponent, PageBaseInfoPageComponent],
  imports: [
    MarkupRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    PerfectScrollbarModule,
    RouterModule,
    AngularSvgIconModule,
    DialogModule,
  ],
  exports: [InfoMessageComponent],
})
export class MarkupModule {}
