import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms';

import { FundsPageComponent } from './pages/funds-page.component'
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [FundsPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            { path: '', component: FundsPageComponent }
        ])
    ]
})
export class FundsModule { }