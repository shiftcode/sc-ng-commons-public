import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlyingFocusModule, TOOLTIP_DEFAULT_OPTIONS, TooltipOptions } from '@shiftcode/ngx-components'
import {
  CONSOLE_LOG_TRANSPORT_CONFIG,
  ConsoleLogTransport,
  ConsoleLogTransportConfig,
  LOCAL_STORAGE_OPTIONS,
  LocalStorageOptions,
  LOG_TRANSPORTS,
  LogLevel,
} from '@shiftcode/ngx-core'
import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component'

const consoleTransportConfig: ConsoleLogTransportConfig = { logLevel: LogLevel.DEBUG }
const localStorageOptions: LocalStorageOptions = { prefix: 'SG_' }


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AppRoutingModule,
    FlyingFocusModule,
  ],
  declarations: [AppComponent],
  providers: [
    // localStorage
    { provide: LOCAL_STORAGE_OPTIONS, useValue: localStorageOptions },

    // logger
    { provide: CONSOLE_LOG_TRANSPORT_CONFIG, useValue: consoleTransportConfig },
    { provide: LOG_TRANSPORTS, useClass: ConsoleLogTransport, multi: true },

    // tooltip
    { provide: TOOLTIP_DEFAULT_OPTIONS, useValue: <Partial<TooltipOptions>>{ showDelay: 0 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
