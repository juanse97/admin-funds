import { Component, OnInit } from "@angular/core";
import { Fund } from "src/app/shared/models/fund.model";
import { FundsService } from "src/app/core/services/funds.service";
import { WalletService } from "src/app/core/services/wallet.service";
import { COLUMNS_SUBSCRIPTIONS } from "src/app/utils/constants";
import { TableColumn } from "src/app/shared/models/data-table.model";

@Component({
    selector: 'app-funds-page',
    templateUrl: './funds-page.component.html'
})
export class FundsPageComponent implements OnInit {
    funds: Fund[] = []
    balance = 0
    notificationMethod: 'EMAIL' | 'SMS' = 'EMAIL'
    isLoading = true
    showModal = false
    typeMessage: 'success' | 'error' | 'info' = 'info'
    titleMessage: string = ''
    message: string = ''
    showChildren = false
    subscribedFunds: Fund[] = []
    modalMode: 'subscribe' | 'unsubscribe' | 'error' | null = null
    columns: TableColumn[] = COLUMNS_SUBSCRIPTIONS
    private fundSelected: Fund | null = null

    constructor(private fundsService: FundsService, private wallet: WalletService) { }

    ngOnInit(): void {
        this.fundsService.getFunds().subscribe({
            next: funds => {
                this.funds = funds
                this.isLoading = false
            },
            error: () => {
                this.isLoading = false
            }
        })
        this.wallet.balance$.subscribe(balance => this.balance = balance)
        this.wallet.subscribedFunds$.subscribe(funds => this.subscribedFunds = funds)
    }

    subscribe(fund: Fund): void {
        if (this.balance < fund.minimumAmount) {

            this.typeMessage = 'error'
            this.titleMessage = 'Saldo insuficiente'
            this.message = 'No tienes saldo suficiente para suscribirte'
            this.modalMode = 'error'
            this.showChildren = false
            this.showModal = true

            return
        }

        this.showModal = true
        this.typeMessage = 'info'
        this.titleMessage = 'Metodo de notificación'
        this.message = 'Selecciona el metodo de notificación'
        this.modalMode = 'subscribe'
        this.showChildren = true
        this.fundSelected = fund
    }

    confirmSubscription(): void {
        if (!this.fundSelected) return

        try {
            this.wallet.subscribeToFund(this.fundSelected)
            this.resetModal()
        } catch (e) {

            this.typeMessage = 'error'
            this.titleMessage = 'Saldo insuficiente'
            this.message = 'No tienes saldo suficiente'
            this.showChildren = false
            this.showModal = true

            return
        }

        this.showModal = false
        this.showChildren = false
        this.fundSelected = null
    }


    cancel(fund: Fund): void {
        this.typeMessage = 'info'
        this.titleMessage = 'Cancelar suscripción'
        this.message = `¿Seguro que deseas cancelar la suscripción al fondo ${fund.name}?`
        this.showChildren = false
        this.modalMode = 'unsubscribe'
        this.showModal = true
        this.fundSelected = fund
    }

    confirmUnsubscribe(): void {
        if (!this.fundSelected) return

        this.wallet.cancelFund(this.fundSelected)
        this.resetModal()
    }

    resetModal(): void {
        this.showModal = false
        this.modalMode = null
        this.fundSelected = null
    }
}