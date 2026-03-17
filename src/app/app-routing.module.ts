import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'funds',
    loadChildren: () =>
      import('./features/funds/funds.module').then(m => m.FundsModule)
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./features/transactions/transactions.module').then(m => m.TransactionsModule)
  },
  { path: '', redirectTo: 'funds', pathMatch: 'full' }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
