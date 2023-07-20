import { AsyncPipe, JsonPipe, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { AutoFocusDirective, RxLetDirective } from '@shiftcode/ngx-components'
import { async, BehaviorSubject, EMPTY, NEVER, Observable, Subject } from 'rxjs'

@Component({
  selector: 'sg-sg-rx',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, RxLetDirective, AutoFocusDirective, NgIf],
  templateUrl: './sg-rx.component.html',
  styleUrls: ['./sg-rx.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgRxComponent {

  protected value$: Observable<number>
  private valueSubject: Subject<number>
  protected needsNewObservable = false

  constructor() {
    this.setNewSubjectAndObservable()
  }

  protected setNewEmpty() {
    this.value$ = NEVER
    this.needsNewObservable = true
  }

  protected next() {
    if (this.needsNewObservable) {
      this.needsNewObservable = false
      this.valueSubject = new Subject()
      this.value$ = this.valueSubject.asObservable()
    }
    setTimeout(()=> {
      this.valueSubject.next(Math.random())
    }, 1000)
  }

  protected error() {
    setTimeout(() => {
      this.needsNewObservable = true
      this.valueSubject.error(new Error('error-by-button'))
    }, 1000)
  }

  protected randomNum() {
    return Math.random()
  }


  private setNewSubjectAndObservable() {
    this.valueSubject = new Subject<number>()
    this.value$ = this.valueSubject.asObservable()
  }

  protected readonly async = async
}
