
export interface TableColumn {
    label: string;
    field: string;
    type?: 'text' | 'currency' | 'badge' | 'action';
}