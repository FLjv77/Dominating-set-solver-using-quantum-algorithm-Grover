import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DominatingSolverRoutingModule } from './dominating-solver-routing.module';
import {DominatingSolverHomeComponent} from "../../dominatingSolver/page/dominating-solver-home/dominating-solver-home.component";
import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
  declarations: [
    DominatingSolverHomeComponent
  ],
  imports: [
    CommonModule,
    DominatingSolverRoutingModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    })
  ]
})
export class DominatingSolverModule { }
