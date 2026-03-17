import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Transaction } from '../../shared/models/transaction.model'

@Injectable({ providedIn: 'root' })
export class TransactionsService {

    private transactionsSubject = new BehaviorSubject<Transaction[]>([])
    transactions$ = this.transactionsSubject.asObservable()

    add(transaction: Transaction): void {
        const current = this.transactionsSubject.value
        this.transactionsSubject.next([transaction, ...current])
    }
}