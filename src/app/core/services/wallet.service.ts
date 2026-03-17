import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Fund } from 'src/app/shared/models/fund.model'
import { Subscription } from 'src/app/shared/models/subscription.model'
import { NotificationMethod } from 'src/app/shared/models/transaction.model'
import { InsufficientBalanceError } from '../errors/wallet.errors'

@Injectable({ providedIn: 'root' })
export class WalletService {

    private balanceSubject = new BehaviorSubject<number>(500000)
    balance$ = this.balanceSubject.asObservable()

    private subscribedFundsSubject = new BehaviorSubject<Subscription[]>([])
    subscribedFunds$ = this.subscribedFundsSubject.asObservable()

    get balance(): number {
        return this.balanceSubject.value
    }

    get subscribedFunds(): Subscription[] {
        return this.subscribedFundsSubject.value
    }

    debit(amount: number): void {
        this.balanceSubject.next(this.balance - amount)
    }

    credit(amount: number): void {
        this.balanceSubject.next(this.balance + amount)
    }

    subscribeToFund(fund: Fund, method: NotificationMethod): void {
        if (this.balance < fund.minimumAmount) {
            throw new InsufficientBalanceError()
        }

        this.balanceSubject.next(this.balance - fund.minimumAmount)
        this.subscribedFundsSubject.next([
            ...this.subscribedFunds,
            {
                id: crypto.randomUUID(),
                fund,
                notificationMethod: method
            }
        ])
    }

    cancelFund(subscription: Subscription): void {
        this.balanceSubject.next(
            this.balance + subscription.fund.minimumAmount
        )

        this.subscribedFundsSubject.next(
            this.subscribedFunds.filter(s => s.id !== subscription.id)
        )
    }

    hasEnoughBalance(amount: number): boolean {
        return this.balance >= amount
    }
}