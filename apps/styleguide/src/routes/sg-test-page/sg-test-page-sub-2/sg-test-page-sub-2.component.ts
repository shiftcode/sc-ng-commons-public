import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { sgTestPageCreateQueryParams } from '../sg-test-page-create-query-params.function'

@Component({
  selector: 'sg-test-page-sub-2',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sg-test-page-sub-2.component.html',
  styleUrls: ['./sg-test-page-sub-2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgTestPageSub2Component {
  protected readonly qp = sgTestPageCreateQueryParams
}
