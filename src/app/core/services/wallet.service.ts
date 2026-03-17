import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Fund } from 'src/app/shared/models/fund.model'

@Injectable({ providedIn: 'root' })
export class WalletService {

    private balanceSubject = new BehaviorSubject<number>(500000)
    balance$ = this.balanceSubject.asObservable()

    private subscribedFundsSubject = new BehaviorSubject<Fund[]>([])
    subscribedFunds$ = this.subscribedFundsSubject.asObservable()

    get balance(): number {
        return this.balanceSubject.value
    }

    get subscribedFunds(): Fund[] {
        return this.subscribedFundsSubject.value
    }

    debit(amount: number): void {
        this.balanceSubject.next(this.balance - amount)
    }

    credit(amount: number): void {
        this.balanceSubject.next(this.balance + amount)
    }

    subscribeToFund(fund: Fund): void {
        this.balanceSubject.next(this.balance - fund.minimumAmount)
        this.subscribedFundsSubject.next([
            ...this.subscribedFunds,
            fund
        ])
    }

    cancelFund(fund: Fund): void {
        this.balanceSubject.next(this.balance + fund.minimumAmount)
        this.subscribedFundsSubject.next(
            this.subscribedFunds.filter(fund => fund.id !== fund.id)
        )
    }
}