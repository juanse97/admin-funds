import { Component, Input, TemplateRef } from '@angular/core';
import { TableColumn } from '../../models/data-table.model';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html'
})
export class DataTableComponent {

    @Input() columns: TableColumn[] = [];
    @Input() data: Record<string, any>[] = [];
    @Input() actionTemplate?: TemplateRef<Record<string, any>>;

    getBadgeLabel(row: Record<string, any>, col: TableColumn): string {
        const value = row[col.field]

        if (col.field === 'type') {
            return value === 'SUBSCRIPTION' ? 'Suscripción' : 'Cancelación'
        }

        if (col.field === 'notificationMethod') {
            return value === 'EMAIL' ? 'Email' : 'SMS'
        }

        return value as string
    }

    getBadgeClass(row: Record<string, any>, col: TableColumn): string {
        const value = row[col.field]

        if (col.field === 'type') {
            return value === 'SUBSCRIPTION'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
        }

        if (col.field === 'notificationMethod') {
            return 'bg-slate-100 text-slate-700'
        }

        if (col.field === 'category') {
            return 'bg-blue-100 text-blue-700'
        }

        return 'bg-slate-100 text-slate-700'
    }

}