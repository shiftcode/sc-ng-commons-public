import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { sgTestPageCreateQueryParams } from '../sg-test-page-create-query-params.function'
import { SgTestRouteQueryParams } from '../sg-test-route-query-params.enum'

@Component({
  selector: 'sg-test-page-sub-2',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sg-test-page-sub-1.component.html',
  styleUrls: ['./sg-test-page-sub-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgTestPageSub1Component {
  protected readonly qp = sgTestPageCreateQueryParams
}
