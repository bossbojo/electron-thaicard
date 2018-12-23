import { BootstrapModule } from './bootstrap.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxElectronModule } from 'ngx-electron';
import { CardComponent } from './card/card.component';
@NgModule({
   declarations: [
      AppComponent,
      CardComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      NgxElectronModule,
      BootstrapModule
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
