import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DominatingSolverRoutingModule } from './dominating-solver-routing.module';
import {DominatingSolverHomeComponent} from "../../dominatingSolver/page/dominating-solver-home/dominating-solver-home.component";
import {NgxEchartsModule} from "ngx-echarts";
import {SharedModule} from "../shared/shared.module";
import {GraphPresenterComponent} from "../../dominatingSolver/page/graph-presenter/graph-presenter.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [
    DominatingSolverHomeComponent,
    GraphPresenterComponent
  ],
  imports: [
    CommonModule,
    DominatingSolverRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    DragDropModule,
    MatSelectModule
  ]
})
export class DominatingSolverModule { }
