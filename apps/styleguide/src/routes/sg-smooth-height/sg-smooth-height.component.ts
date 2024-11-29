import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SmoothHeightComponent } from '@shiftcode/ngx-components'

@Component({
    selector: 'sg-smooth-height',
    imports: [SmoothHeightComponent],
    templateUrl: './sg-smooth-height.component.html',
    styleUrls: ['./sg-smooth-height.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgSmoothHeightComponent {
  content = ''

  private loremIpsum = [
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    'Amet asperiores corporis cupiditate doloremque eveniet explicabo, facere labore laudantium quidem sequi.',
    'A ab ad corporis cum deleniti fuga ipsam nemo quisquam.',
    'Aliquam culpa debitis dignissimos eos libero magnam mollitia, placeat rerum?',
    'Consequatur hic inventore iure, officia perferendis placeat repudiandae totam voluptatem voluptatum!',
    'Dolorem nesciunt repellat ullam vel. Aliquam dicta laborum qui!',
    'Corporis dignissimos impedit natus nihil nostrum.',
    'Accusantium asperiores consequatur corporis cum cupiditate delectus dolorem dolores ' +
    'eos fugiat harum hic libero neque nisi quibusdam, ' +
    'quidem recusandae reiciendis repudiandae sapiente similique sunt!',
  ]

  constructor() {
    this.changeContent()
  }

  changeContent() {
    this.content = this.loremIpsum.slice(0, Math.ceil(Math.random() * this.loremIpsum.length)).join('\n')
  }
}
