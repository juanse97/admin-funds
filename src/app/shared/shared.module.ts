import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';
import { FundCardComponent } from './components/fund-card/fund-card.component';
import { DataTableComponent } from './components/data-table/data-table.component';

@NgModule({
    declarations: [
        LoadingComponent,
        ModalComponent,
        FundCardComponent,
        DataTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        LoadingComponent,
        ModalComponent,
        FundCardComponent,
        DataTableComponent
    ]
})
export class SharedModule { }