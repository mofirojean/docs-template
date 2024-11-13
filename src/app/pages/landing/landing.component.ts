import {ChangeDetectionStrategy, Component} from '@angular/core';
import {faBrandIcon, faIcon} from '../../utils/icon.utils';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  protected readonly faBrandIcon = faBrandIcon;
  protected readonly faIcon = faIcon;
}
