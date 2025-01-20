import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { TextareaAutosizeDirective } from '@shiftcode/ngx-components'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'sg-text-area-autosize',
  imports: [ReactiveFormsModule, TextareaAutosizeDirective],
  templateUrl: './sg-text-area-autosize.component.html',
  styleUrls: ['./sg-text-area-autosize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgTextAreaAutosizeComponent implements OnDestroy {
  readonly textCtrl = new FormControl<string>('hello\nWorld\ntype more to see what happens', { nonNullable: true })

  private readonly onDestroy = new Subject<void>()

  constructor() {
    this.onDestroy.subscribe(() => 'component destroyed')
    this.textCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((val) => {
      this.textCtrl.setValue(val, {
        onlySelf: true,
        emitEvent: false,
        emitModelToViewChange: true,
        emitViewToModelChange: true,
      })
    })
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }
}
