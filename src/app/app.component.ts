import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { getLocalStorage } from './windows';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Angular && Electron';
  Maximize: Boolean = true;
  status: any = 'activated';
  loading: any;
  response: any;
  constructor(private _electronService: ElectronService, private zone: NgZone) {
  }
  ngOnInit() {
    this.OnActiveCardReader();
  }
  OnActiveCardReader() {
    if (this._electronService.isElectronApp) {
      // this._electronService.ipcRenderer.removeAllListeners('on-active-reader-card');
      this._electronService.ipcRenderer.on('response', (event: any, arg: any) => {
        this.zone.run(() => {
          this.OnSetResponse(arg);
          console.log(this.response);
        });
      });
      this._electronService.ipcRenderer.on('status', (event: any, arg: any) => {
        this.zone.run(() => {
          this.OnSetStatus(arg);
          console.log(this.status);
        });
      });
      this._electronService.ipcRenderer.on('loading', (event: any, arg: any) => {
        this.zone.run(() => {
          this.OnSetLoading(arg);
          console.log(this.loading);
        });
      });
      this._electronService.ipcRenderer.send('on-active-reader-card', 'active');
    }
  }
  OnSetLoading(data) {
    this.loading = data;
  }
  OnSetResponse(data) {
    this.response = data;
    getLocalStorage().setItem('maincard', JSON.stringify(data));
  }
  OnSetStatus(data) {
    this.status = data;
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

