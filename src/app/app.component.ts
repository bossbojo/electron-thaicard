import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { getLocalStorage } from './windows';
import { ModelCard } from './model';

declare let UIkit;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('modalfull') model1: Element;
  Maximize: Boolean = true;
  status: any = 'activated';
  loading: any;
  response: ModelCard;
  response2: ModelCard;
  payload = {
    option: 0,
    choose: 0,
    info1: null,
    info2: null
  };
  constructor(private _electronService: ElectronService, private zone: NgZone) { }
  ngOnInit() {
    this.OnActiveCardReader();
    UIkit.modal('#modalfull').show();
  }
  OnActiveCardReader() {
    if (this._electronService.isElectronApp) {
      // this._electronService.ipcRenderer.removeAllListeners('on-active-reader-card');
      this._electronService.ipcRenderer.on('response', (event: any, arg: any) => {
        this.zone.run(() => {
          this.OnSetResponse(arg);
        });
      });
      this._electronService.ipcRenderer.on('status', (event: any, arg: any) => {
        this.zone.run(() => {
          this.OnSetStatus(arg);
        });
      });
      this._electronService.ipcRenderer.on('loading', (event: any, arg: any) => {
        this.zone.run(() => {
          this.OnSetLoading(arg);
        });
      });
      this._electronService.ipcRenderer.send('on-active-reader-card', 'active');
    }
  }
  OnSetLoading(data) {
    this.loading = data;
  }
  OnSetResponse(data) {
    if (this.payload.option === 0) {
      this.response = <ModelCard>data;
      this.payload.info1 = this.response;
    } else {
      this.response2 = <ModelCard>data;
      this.payload.info2 = this.response2;
    }
  }
  OnSetStatus(data) {
    this.status = data;
    if (this.status === 'success') {
      UIkit.modal('#modalfull').hide();
    } else {
      UIkit.modal('#modalfull').show();
      if (this.payload.option !== 1) {
        this.payload.choose = 0;
        this.payload.option = 0;
        this.payload.info1 = null;
        this.payload.info2 = null;
      }
    }
  }
  OnAddMan() {
    this.payload.option = 1;
    this.status = 'waitMan';
  }
  OnCancelInfo2() {
    this.response2 = null;
    this.payload.option = 0;
    this.payload.info2 = null;
  }
  OnPick(num) {
    this.payload.choose = num;
    console.log(this.payload);
  }
  OnMinimizeWindow() {
    if (this._electronService.isElectronApp) {
      const window = this._electronService.remote.BrowserWindow.getFocusedWindow();
      window.minimize();
    }
  }
  OnMaximizeWindow() {
    if (this._electronService.isElectronApp) {
      const window = this._electronService.remote.BrowserWindow.getFocusedWindow();
      window.isMaximized() ? window.unmaximize() : window.maximize();
      this.Maximize = !this.Maximize;
    }
  }
  OnCloseScreen() {
    if (this._electronService.isElectronApp) {
      const window = this._electronService.remote.BrowserWindow.getFocusedWindow();
      window.close();
    }
  }
}

