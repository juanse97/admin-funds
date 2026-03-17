import { TableColumn } from "src/app/shared/models/data-table.model";

export const COLUMNS_SUBSCRIPTIONS: TableColumn[] = [
    { label: 'Fondo', field: 'name' },
    { label: 'Categoría', field: 'category', type: 'badge' },
    { label: 'Monto', field: 'minimumAmount', type: 'currency' },
    { label: 'Notificación', field: 'notificationMethod', type: 'badge' },
    { label: 'Acciones', field: 'action', type: 'action' }
]