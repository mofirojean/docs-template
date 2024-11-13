import {
  NG_DOC_DEFAULT_PAGE_PROCESSORS,
  NG_DOC_DEFAULT_PAGE_SKELETON,
  NgDocDefaultSearchEngine,
  provideMainPageProcessor,
  provideMermaid,
  provideNgDocApp,
  providePageSkeleton,
  provideSearchEngine
} from "@ng-doc/app";
import {provideNgDocContext} from "@ng-doc/generated";
import {provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {provideClientHydration} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideAnimations(),
    provideMermaid(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      [
        {
          path: 'docs',
          loadChildren: () => import('./pages/docs/docs.routes'),
        },
        {
          path: '',
          loadChildren: () => import('./pages/landing/landing.routes'),
          pathMatch: 'full',
          data: {hideSidebar: true},
        },
        {
          path: '**',
          redirectTo: 'docs/getting-started/installation',
          pathMatch: 'full',
        },
      ],
      withInMemoryScrolling(
        {
          scrollPositionRestoration: "enabled",
          anchorScrolling: "enabled"
        }
      )
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    provideNgDocContext(),
    provideNgDocApp(),
    provideSearchEngine(NgDocDefaultSearchEngine),
    providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
    provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS)
  ]
};
