import { Component, OnInit } from '@angular/core'
import { delay } from 'rxjs'
import { TransactionsService } from 'src/app/core/services/transactions.service'
import { TableColumn } from 'src/app/shared/models/data-table.model'
import { Transaction } from 'src/app/shared/models/transaction.model'
import { COLUMNS_TRANSACTIONS } from 'src/app/utils/constants'

@Component({
    selector: 'app-transactions-page',
    templateUrl: './transactions-page.component.html'
})
export class TransactionsPageComponent implements OnInit {
    transactions: Transaction[] = []
    columns: TableColumn[] = COLUMNS_TRANSACTIONS
    isLoading = true

    constructor(private transactionsService: TransactionsService) { }

    ngOnInit() {
        this.transactionsService.transactions$.pipe(delay(1000))
            .subscribe({
                next: transactions => {
                    this.transactions = transactions
                    this.isLoading = false
                },
                error: () => {
                    this.isLoading = false
                }
            })
    }

}