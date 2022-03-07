import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NodeGraphComponent } from "../../utility/page/node-graph/node-graph.component";
import { EdgeGraphComponent } from "../../utility/page/edge-graph/edge-graph.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    NodeGraphComponent,
    EdgeGraphComponent
  ],
  exports: [
    NodeGraphComponent,
    EdgeGraphComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    DragDropModule,
    MatSelectModule
  ]
})
export class SharedModule { }
