import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fund } from '../../models/fund.model';

@Component({
    selector: 'app-fund-card',
    templateUrl: './fund-card.component.html'
})
export class FundCardComponent {

    @Input() fund!: Fund;
    @Input() balance = 0;

    @Output() subscribe = new EventEmitter<Fund>()

}