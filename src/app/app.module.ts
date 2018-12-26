import { BootstrapModule } from './bootstrap.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxElectronModule } from 'ngx-electron';
import { CardComponent } from './card/card.component';

import { MomentModule } from 'ngx-moment';
import { Card2Component } from './card2/card2.component';
@NgModule({
   declarations: [
      AppComponent,
      CardComponent,
      Card2Component
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      NgxElectronModule,
      BootstrapModule,
      MomentModule
   ],
   exports: [
      BootstrapModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
