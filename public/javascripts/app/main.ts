import {bootstrap}    from '@angular/platform-browser-dynamic'
import {IndexComponent} from './site/index.component'

import { APP_ROUTER_PROVIDER } from './routes/app.routes';

bootstrap(IndexComponent,[
  APP_ROUTER_PROVIDER
]);