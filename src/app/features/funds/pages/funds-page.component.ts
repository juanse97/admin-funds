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
import { delay } from "rxjs";
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

    constructor(private fundsService: FundsService, private wallet: WalletService, private transactionsService: TransactionsService) { }

    ngOnInit(): void {
        this.loadFunds()
        this.wallet.balance$.subscribe(balance => this.balance = balance)
        this.wallet.subscribedFunds$.subscribe(funds => this.subscribedFunds = funds)
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

        try {
            this.wallet.subscribeToFund(this.selectedFund,
                this.notificationMethod)
            this.transactionsService.add({
                id: crypto.randomUUID(),
                fundId: this.selectedFund.id,
                fundName: this.selectedFund.name,
                type: 'SUBSCRIPTION',
                amount: this.selectedFund.minimumAmount,
                date: new Date().toISOString(),
                notificationMethod: this.notificationMethod
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

        this.wallet.cancelFund(this.selectedSubscription)
        this.transactionsService.add({
            id: crypto.randomUUID(),
            fundId: this.selectedSubscription.fund.id,
            fundName: this.selectedSubscription.fund.name,
            type: 'CANCEL',
            amount: this.selectedSubscription.fund.minimumAmount,
            date: new Date().toISOString(),
            notificationMethod: this.notificationMethod
        })

        this.resetModal()
    }

    resetModal(): void {
        this.showModal = false
        this.modalMode = null
        this.selectedFund = null
    }

    tableData() {
        return this.subscribedFunds.map(subscription => ({
            ...subscription,
            name: subscription.fund.name,
            category: subscription.fund.category,
            minimumAmount: subscription.fund.minimumAmount
        }))
    }
}