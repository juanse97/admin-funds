export type NotificationMethod = 'EMAIL' | 'SMS'

export interface Transaction {
    id: string
    fundId: number
    fundName: string
    type: 'SUBSCRIPTION' | 'CANCEL'
    amount: number
    notificationMethod: NotificationMethod
    date: string
}