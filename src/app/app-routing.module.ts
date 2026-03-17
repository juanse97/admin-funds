import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'funds',
    loadChildren: () =>
      import('./features/funds/funds.module').then(m => m.FundsModule)
  },
  { path: '', redirectTo: 'funds', pathMatch: 'full' }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
