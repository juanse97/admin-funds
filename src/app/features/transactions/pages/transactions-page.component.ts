import { Component } from '@angular/core'
import { delay, map, startWith } from 'rxjs'
import { TransactionsService } from 'src/app/core/services/transactions.service'
import { TableColumn } from 'src/app/shared/models/data-table.model'
import { COLUMNS_TRANSACTIONS } from 'src/app/utils/constants'

@Component({
    selector: 'app-transactions-page',
    templateUrl: './transactions-page.component.html'
})
export class TransactionsPageComponent {
    columns: TableColumn[] = COLUMNS_TRANSACTIONS
    viewModel$ = this.transactionsService.transactions$.pipe(
        delay(1000),
        map(transactions => ({
            transactions,
            loading: false,
            error: null
        })),
        startWith({
            transactions: [],
            loading: true,
            error: null
        })
    )

    constructor(private transactionsService: TransactionsService) { }

}