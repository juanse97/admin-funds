import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class WalletService {

    private balanceSubject = new BehaviorSubject<number>(500000)
    balance$ = this.balanceSubject.asObservable()

    get balance(): number {
        return this.balanceSubject.value
    }

    debit(amount: number) {
        this.balanceSubject.next(this.balance - amount)
    }

    credit(amount: number) {
        this.balanceSubject.next(this.balance + amount)
    }
}