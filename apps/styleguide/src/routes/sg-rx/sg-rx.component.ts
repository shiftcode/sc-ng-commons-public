import { JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { AutoFocusDirective, RxIfDirective, RxLetDirective } from '@shiftcode/ngx-components'
import { Observable, ReplaySubject, Subject } from 'rxjs'


class TestObsController {
  get value$() {
    return this._value$
  }

  private _value$: Observable<number> | null
  private valueSubject: Subject<number>
  private _needsNewObservable = true

  setNull() {
    this._needsNewObservable = true
    this._value$ = null
  }

  setNewEmpty() {
    this.setObservable(new Subject())
  }

  readonly nextAsync = () => {
    this.ensureSubject()
    setTimeout(this.emitValue, 1_000)
  }

  readonly next = () => {
    this.ensureSubject(() => new ReplaySubject(1))
    this.emitValue()
  }

  readonly errorAsync = () => {
    this.ensureSubject()
    setTimeout(this.emitError, 1_000)
  }

  readonly error = () => {
    this.ensureSubject()
    this.emitError()
  }

  private emitValue = () => {
    this.valueSubject.next(Math.random())
  }
  private emitError = () => {
    this.valueSubject.error(new Error('error-by-button'))
    this._needsNewObservable = true
  }

  private ensureSubject(factoryFn: () => Subject<number> = () => new Subject()) {
    if (this._needsNewObservable) {
      this.setObservable(factoryFn())
    }
  }

  private setObservable(subject: Subject<number>) {
    this._needsNewObservable = false
    this.valueSubject = subject
    this._value$ = this.valueSubject.asObservable()
  }
}

@Component({
  selector: 'sg-sc-rx',
  imports: [JsonPipe, AutoFocusDirective, RxLetDirective, RxIfDirective],
  templateUrl: './sg-rx.component.html',
  styleUrls: ['./sg-rx.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgRxComponent {

  readonly rxLetObs = new TestObsController()
  readonly rxIfObs = new TestObsController()

  protected randomNum() {
    return Math.random()
  }


}
