import { provideRouter, RouterConfig } from '@angular/router';

import { GameScreen } from '../site/gameScreen/gameScreen.component';
import { MainMenuComponent } from '../site/mainMenu.component';

export const appRoutes: RouterConfig = [
  { path: '', component: MainMenuComponent },
  { path: 'game', component: GameScreen }
];

export const APP_ROUTER_PROVIDER = provideRouter(appRoutes);
