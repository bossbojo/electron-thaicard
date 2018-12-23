import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { getLocalStorage } from './windows';
import { ModelCard } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Angular && Electron';
  Maximize: Boolean = true;
  status: any = '';
  loading: any;
  response: ModelCard;
  constructor(private _electronService: ElectronService, private zone: NgZone) {
    // console.log(getLocalStorage().getItem('maincard'));
    
    // this.response = <ModelCard>JSON.parse(getLocalStorage().getItem('maincard'));
    // console.log(this.response.citizen_id);
    
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
        });
      });
      this._electronService.ipcRenderer.on('status', (event: any, arg: any) => {
        this.zone.run(() => {
          this.OnSetStatus(arg);
          //console.log(this.status);
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
    console.log(data);
    
    this.response = <ModelCard>data;
    //getLocalStorage().setItem('maincard', JSON.stringify(data));
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

