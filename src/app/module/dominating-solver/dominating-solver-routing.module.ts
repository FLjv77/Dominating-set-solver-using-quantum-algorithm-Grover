import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DominatingSolverHomeComponent} from "../../dominatingSolver/page/dominating-solver-home/dominating-solver-home.component";

const routes: Routes = [
  {path: '', component: DominatingSolverHomeComponent},
  {path: 'Home', component: DominatingSolverHomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DominatingSolverRoutingModule { }
