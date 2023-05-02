import { NgForOf } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { LocalStorage, LoggerService } from '@shiftcode/ngx-core'

@Component({
  selector: 'sg-sg-local-storage',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule],
  templateUrl: './sg-local-storage.component.html',
  styleUrls: ['./sg-local-storage.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgLocalStorageComponent {
  readonly grp = new FormGroup({
    key: new FormControl<string | null>(null, Validators.required),
    value: new FormControl<string | null>(null, Validators.required),
  })
  readonly ls = inject(LocalStorage)
  private readonly logger = inject(LoggerService).getInstance('SgLocalStorageComponent')

  save() {
    const { key, value } = this.grp.getRawValue()
    if (key && value) {
      this.logger.debug('save to ls', key, value)
      this.ls.setItem(key, value)
    }
  }
}
