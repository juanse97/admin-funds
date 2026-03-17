import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalType } from '../../models/modal.model';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html'
})
export class ModalComponent {

    @Input() isOpen = false;
    @Input() title = '';
    @Input() message = '';
    @Input() type: ModalType = 'info';
    @Input() showContent = false;

    @Output() close = new EventEmitter<void>();

    closeModal(): void {
        this.close.emit();
    }

    get iconColor(): string {
        switch (this.type) {
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-blue-600';
        }
    }

    get iconBg(): string {
        switch (this.type) {
            case 'success':
                return 'bg-green-100';
            case 'error':
                return 'bg-red-100';
            default:
                return 'bg-blue-100';
        }
    }

}