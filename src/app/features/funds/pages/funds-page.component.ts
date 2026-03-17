import { Component, OnInit } from "@angular/core";
import { Fund } from "src/app/shared/models/fund.model";
import { FundsService } from "src/app/core/services/funds.service";
import { WalletService } from "src/app/core/services/wallet.service";
import { COLUMNS_SUBSCRIPTIONS } from "src/app/utils/constants";
import { TableColumn } from "src/app/shared/models/data-table.model";
import { TransactionsService } from "src/app/core/services/transactions.service";
import { Subscription } from "src/app/shared/models/subscription.model";
import { ModalType } from "src/app/shared/models/modal.model";
import { NotificationMethod } from "src/app/shared/models/transaction.model";
import { delay, map } from "rxjs";
import { InsufficientBalanceError } from "src/app/core/errors/wallet.errors";

@Component({
    selector: 'app-funds-page',
    templateUrl: './funds-page.component.html'
})
export class FundsPageComponent implements OnInit {
    funds: Fund[] = []
    balance = 0
    notificationMethod: NotificationMethod = 'EMAIL'
    isLoading = true
    showModal = false
    typeMessage: ModalType = 'info'
    titleMessage: string = ''
    message: string = ''
    showChildren = false
    subscribedFunds: Subscription[] = []
    modalMode: 'subscribe' | 'unsubscribe' | 'error' | null = null
    columns: TableColumn[] = COLUMNS_SUBSCRIPTIONS
    private selectedFund: Fund | null = null
    private selectedSubscription: Subscription | null = null
    hasError = false
    errorMessage = ''
    balance$ = this.wallet.balance$
    subscribedFunds$ = this.wallet.subscribedFunds$

    constructor(private fundsService: FundsService, private wallet: WalletService, private transactionsService: TransactionsService) { }

    ngOnInit(): void {
        this.loadFunds()
    }

    loadFunds(): void {

        this.isLoading = true
        this.hasError = false

        this.fundsService.getFunds().pipe(delay(1000)).subscribe({
            next: funds => {
                this.funds = funds
                this.isLoading = false
            },
            error: () => {
                this.isLoading = false
                this.hasError = true
                this.errorMessage = 'No se pudieron cargar los fondos.'
            }
        })
    }

    subscribe(fund: Fund): void {
        this.showModal = true
        this.typeMessage = 'info'
        this.titleMessage = 'Método de notificación'
        this.message = 'Selecciona el método de notificación'
        this.modalMode = 'subscribe'
        this.selectedFund = fund
    }

    confirmSubscription(): void {
        if (!this.selectedFund) return

        const method = this.notificationMethod

        try {
            this.wallet.subscribeToFund(this.selectedFund, method)
            this.transactionsService.add({
                id: crypto.randomUUID(),
                fundId: this.selectedFund.id,
                fundName: this.selectedFund.name,
                type: 'SUBSCRIPTION',
                amount: this.selectedFund.minimumAmount,
                date: new Date().toISOString(),
                notificationMethod: method
            })
            this.resetModal()
        } catch (error) {
            this.typeMessage = 'error'
            this.modalMode = 'error'
            this.showModal = true

            if (error instanceof InsufficientBalanceError) {
                this.titleMessage = 'Saldo insuficiente'
                this.message = error.message
                return
            }

            this.titleMessage = 'Error'
            this.message = 'Ocurrió un error inesperado'
        }
    }


    cancel(subscription: Subscription): void {
        this.selectedSubscription = subscription
        this.typeMessage = 'info'
        this.titleMessage = 'Cancelar suscripción'
        this.message = `¿Seguro que deseas cancelar la suscripción al fondo ${subscription.fund.name}?`
        this.showChildren = false
        this.modalMode = 'unsubscribe'
        this.showModal = true
    }

    confirmUnsubscribe(): void {
        if (!this.selectedSubscription) return
        const method = this.selectedSubscription.notificationMethod

        this.wallet.cancelFund(this.selectedSubscription)
        this.transactionsService.add({
            id: crypto.randomUUID(),
            fundId: this.selectedSubscription.fund.id,
            fundName: this.selectedSubscription.fund.name,
            type: 'CANCEL',
            amount: this.selectedSubscription.fund.minimumAmount,
            date: new Date().toISOString(),
            notificationMethod: method
        })

        this.resetModal()
    }

    resetModal(): void {
        this.showModal = false
        this.modalMode = null
        this.selectedFund = null
    }

    tableData$ = this.wallet.subscribedFunds$.pipe(
        map(subscriptions =>
            subscriptions.map(s => ({
                id: s.id,
                name: s.fund.name,
                category: s.fund.category,
                minimumAmount: s.fund.minimumAmount,
                notificationMethod: s.notificationMethod,
                original: s
            }))
        )
    )
}