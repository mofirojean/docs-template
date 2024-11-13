import {NgDocNavbarComponent, NgDocRootComponent, NgDocSidebarComponent, NgDocThemeToggleComponent} from "@ng-doc/app";
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Location, isPlatformBrowser} from "@angular/common";
import {NgDocIconComponent, NgDocTooltipDirective} from "@ng-doc/ui-kit";
import {preventInitialChildAnimations} from '@ng-doc/ui-kit/animations';
import {faBrandIcon, faIcon} from "./utils/icon.utils";
import {NgDocThemeService} from "@ng-doc/app/services/theme";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
    NgDocThemeToggleComponent,
    NgDocIconComponent,
    NgDocTooltipDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [preventInitialChildAnimations]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'docs-template';
  private readonly systemDarkModeListener: MediaQueryList | undefined
  protected readonly location = inject(Location);
  protected readonly faBrandIcon = faBrandIcon;
  protected readonly faIcon = faIcon;

  constructor(
    private ngDocThemeService: NgDocThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.systemDarkModeListener = window.matchMedia('(prefers-color-scheme: dark)');
    }
  }

  @HostBinding('attr.data-doc-is-landing')
  get isLandingPage(): boolean {
    return this.location.path() === '';
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ngDocThemeService.themeChanges().subscribe((theme) => {
      theme === 'auto' ? this.applySystemTheme() : this.updateTailwindTheme(theme);
    });

    this.systemDarkModeListener?.addEventListener('change', this.applySystemTheme);

    // Apply the initial theme
    this.ngDocThemeService.currentTheme === 'auto'
      ? this.applySystemTheme()
      : this.updateTailwindTheme(this.ngDocThemeService.currentTheme);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.systemDarkModeListener) {
      this.systemDarkModeListener.removeEventListener('change', this.applySystemTheme);
    }
  }

  /**
   * Apply the system theme based on the user's OS setting.
   */
  private applySystemTheme = (): void => {
    const isSystemDark = this.systemDarkModeListener?.matches;
    this.updateTailwindTheme(isSystemDark ? 'dark' : 'light');
  };

  /**
   * Update the TailwindCSS theme based on the specified theme.
   * @param theme - The current theme, either 'dark' or 'light'.
   */
  private updateTailwindTheme(theme: string | null): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}
