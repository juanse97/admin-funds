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

    transactions$ = this.transactionsService.transactions$.pipe(
        delay(1000)
    )

    isLoading$ = this.transactions$.pipe(
        map(() => false),
        startWith(true)
    )

    constructor(private transactionsService: TransactionsService) { }

}