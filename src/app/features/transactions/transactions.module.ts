import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms';

import { TransactionsPageComponent } from './pages/transactions-page.component'
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [TransactionsPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            { path: '', component: TransactionsPageComponent }
        ])
    ]
})
export class TransactionsModule { }