import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';
import { FundCardComponent } from './components/fund-card/fund-card.component';

@NgModule({
    declarations: [
        LoadingComponent,
        ModalComponent,
        FundCardComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        LoadingComponent,
        ModalComponent,
        FundCardComponent
    ]
})
export class SharedModule { }