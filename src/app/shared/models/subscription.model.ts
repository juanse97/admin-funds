import { Fund } from './fund.model'
import { NotificationMethod } from './transaction.model'

export interface Subscription {
    fund: Fund
    notificationMethod: NotificationMethod
}