import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DominatingSolverModule} from "./module/dominating-solver/dominating-solver.module";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'DominatingSolver/Home', pathMatch: 'full'
  },
  {
    path: 'DominatingSolver',
    loadChildren: async () => await import('./module/dominating-solver/dominating-solver.module').then((m) => DominatingSolverModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
