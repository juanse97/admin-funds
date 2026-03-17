import { TestBed } from '@angular/core/testing';
import { WalletService } from './wallet.service';
import { Fund } from '../../shared/models/fund.model';
import { Subscription as FundSubscription } from '../../shared/models/subscription.model';

describe('WalletService', () => {
  let service: WalletService;

  const mockFund: Fund = {
    id: 1,
    name: 'FPV_BTG_PACTUAL_RECAUDADORA',
    minimumAmount: 75000,
    category: 'FPV'
  };

  const mockFund2: Fund = {
    id: 2,
    name: 'DEUDAPRIVADA',
    minimumAmount: 50000,
    category: 'FIC'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('balance', () => {
    it('debería iniciar con un saldo inicial de 500000', () => {
      expect(service.balance).toBe(500000);
    });

    it('debería emitir el saldo inicial en balance$', () => {
      let resultado = 0;
      service.balance$.subscribe(b => resultado = b);
      expect(resultado).toBe(500000);
    });
  });

  describe('debit', () => {
    it('debería restar el monto del saldo', () => {
      service.debit(100000);
      expect(service.balance).toBe(400000);
    });

    it('debería emitir el saldo actualizado después de debitar', () => {
      let resultado = 0;
      service.balance$.subscribe(b => resultado = b);
      service.debit(200000);
      expect(resultado).toBe(300000);
    });
  });

  describe('credit', () => {
    it('debería sumar el monto al saldo', () => {
      service.credit(50000);
      expect(service.balance).toBe(550000);
    });

    it('debería emitir el saldo actualizado después de acreditar', () => {
      let resultado = 0;
      service.balance$.subscribe(b => resultado = b);
      service.credit(100000);
      expect(resultado).toBe(600000);
    });
  });

  describe('hasEnoughBalance', () => {
    it('debería retornar true cuando el monto es menor al saldo', () => {
      expect(service.hasEnoughBalance(400000)).toBeTrue();
    });

    it('debería retornar true cuando el monto es igual al saldo', () => {
      expect(service.hasEnoughBalance(500000)).toBeTrue();
    });

    it('debería retornar false cuando el saldo es insuficiente', () => {
      expect(service.hasEnoughBalance(500001)).toBeFalse();
    });
  });

  describe('subscribeToFund', () => {
    it('debería debitar el monto mínimo del fondo del saldo', () => {
      service.subscribeToFund(mockFund, 'EMAIL');
      expect(service.balance).toBe(500000 - 75000);
    });

    it('debería agregar el fondo a la lista de fondos suscritos', () => {
      service.subscribeToFund(mockFund, 'EMAIL');
      const subs = service.subscribedFunds;
      expect(subs.length).toBe(1);
      expect(subs[0].fund).toEqual(mockFund);
      expect(subs[0].notificationMethod).toBe('EMAIL');
    });

    it('debería lanzar error si el saldo es insuficiente', () => {
      const expensiveFund: Fund = {
        id: 3,
        name: 'FONDO_CARO',
        minimumAmount: 600000,
        category: 'FPV'
      };

      expect(() => {
        service.subscribeToFund(expensiveFund, 'EMAIL');
      }).toThrow();
    });

    it('debería soportar el método de notificación SMS', () => {
      service.subscribeToFund(mockFund, 'SMS');
      expect(service.subscribedFunds[0].notificationMethod).toBe('SMS');
    });

    it('debería permitir suscribirse a múltiples fondos', () => {
      service.subscribeToFund(mockFund, 'EMAIL');
      service.subscribeToFund(mockFund2, 'SMS');
      expect(service.subscribedFunds.length).toBe(2);
      expect(service.balance).toBe(500000 - 75000 - 50000);
    });

    it('debería emitir subscribedFunds$ actualizado', () => {
      let resultado: FundSubscription[] = [];
      service.subscribedFunds$.subscribe(f => resultado = f);

      service.subscribeToFund(mockFund, 'EMAIL');

      expect(resultado.length).toBe(1);
      expect(resultado[0].fund.id).toBe(1);
    });
  });

  describe('cancelFund', () => {
    beforeEach(() => {
      service.subscribeToFund(mockFund, 'EMAIL');
      service.subscribeToFund(mockFund2, 'SMS');
    });

    it('debería acreditar el monto mínimo del fondo al saldo', () => {
      const balanceDespues = service.balance;
      const sub = service.subscribedFunds.find(s => s.fund.id === mockFund.id)!;
      service.cancelFund(sub);
      expect(service.balance).toBe(balanceDespues + mockFund.minimumAmount);
    });

    it('debería eliminar el fondo de la lista de suscritos', () => {
      const sub = service.subscribedFunds.find(s => s.fund.id === mockFund.id)!;
      service.cancelFund(sub);
      expect(service.subscribedFunds.length).toBe(1);
      expect(service.subscribedFunds[0].fund.id).toBe(2);
    });

    it('debería emitir subscribedFunds$ actualizado después de cancelar', () => {
      let resultado: FundSubscription[] = [];
      service.subscribedFunds$.subscribe(f => resultado = f);

      const sub = service.subscribedFunds.find(s => s.fund.id === mockFund2.id)!;
      service.cancelFund(sub);

      expect(resultado.length).toBe(1);
      expect(resultado[0].fund.id).toBe(1);
    });

    it('debería restaurar el saldo completo cuando se cancelan todos los fondos', () => {
      const sub1 = service.subscribedFunds.find(s => s.fund.id === mockFund.id)!;
      const sub2 = service.subscribedFunds.find(s => s.fund.id === mockFund2.id)!;
      service.cancelFund(sub1);
      service.cancelFund(sub2);
      expect(service.balance).toBe(500000);
      expect(service.subscribedFunds.length).toBe(0);
    });
  });
});