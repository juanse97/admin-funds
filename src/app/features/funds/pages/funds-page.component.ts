import { Component, OnInit } from "@angular/core";
import { Fund } from "src/app/shared/models/fund.model";
import { FundsService } from "src/app/core/services/funds.service";
import { WalletService } from "src/app/core/services/wallet.service";

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
    fundSelected: Fund | null = null

    constructor(private fundsService: FundsService, private wallet: WalletService) { }

    ngOnInit() {
        this.fundsService.getFunds().subscribe({
            next: funds => {
                this.funds = funds
                this.isLoading = false
            },
            error: () => {
                this.isLoading = false
            }
        })
        this.wallet.balance$.subscribe(b => this.balance = b)
    }

    subscribe(fund: Fund) {
        if (this.balance < fund.minimumAmount) {

            this.typeMessage = 'error'
            this.titleMessage = 'Saldo insuficiente'
            this.message = 'No tienes saldo suficiente para suscribirte'
            this.showChildren = false
            this.showModal = true

            return
        }

        this.showModal = true
        this.typeMessage = 'info'
        this.titleMessage = 'Metodo de notificación'
        this.message = 'Selecciona el metodo de notificación'
        this.showChildren = true
        this.fundSelected = fund
    }

    confirmSubscription() {
        this.showModal = false
        this.showChildren = false
        console.log("Fondo seleccionado: ", this.fundSelected)
        this.wallet.debit(this.fundSelected?.minimumAmount || 0)
    }
}