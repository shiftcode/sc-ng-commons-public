import { NgModule } from '@angular/core'
import { provideOrigin } from './provide-origin.function'

/** @deprecated use {@link provideOrigin} environment provider function */
@NgModule({ providers: [provideOrigin()] })
export class OriginModule {}
