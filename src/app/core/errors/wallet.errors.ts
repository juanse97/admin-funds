export class InsufficientBalanceError extends Error {
    constructor() {
        super('No tienes saldo suficiente')
        this.name = 'InsufficientBalanceError'
    }
}