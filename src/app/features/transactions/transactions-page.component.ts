import { Component, OnInit } from '@angular/core'
import { TransactionsService } from 'src/app/core/services/transactions.service'
import { TableColumn } from 'src/app/shared/models/data-table.model'
import { Transaction } from 'src/app/shared/models/transaction.model'

@Component({
    selector: 'app-transactions-page',
    templateUrl: './transactions-page.component.html'
})
export class TransactionsPageComponent implements OnInit {

    transactions: Transaction[] = []

    columns: TableColumn[] = [
        { label: 'Fondo', field: 'fundName' },
        { label: 'Tipo', field: 'type', type: 'badge' },
        { label: 'Monto', field: 'amount', type: 'currency' },
        { label: 'Fecha', field: 'date', type: 'date' }
    ]

    constructor(private transactionsService: TransactionsService) { }

    ngOnInit() {
        this.transactionsService.transactions$
            .subscribe(transactions => this.transactions = transactions)
    }

}