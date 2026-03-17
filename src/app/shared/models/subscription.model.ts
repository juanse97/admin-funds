import { Fund } from './fund.model'
import { NotificationMethod } from './transaction.model'

export interface Subscription {
    id: string
    fund: Fund
    notificationMethod: NotificationMethod
}