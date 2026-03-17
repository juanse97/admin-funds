import { Component, Input, TemplateRef } from '@angular/core';
import { TableColumn } from '../../models/data-table.model';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html'
})
export class DataTableComponent {

    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() actionTemplate?: TemplateRef<any>;

}