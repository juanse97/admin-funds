import { TestBed } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../../shared/models/transaction.model';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockTransaction: Transaction = {
    id: 'tx-001',
    fundId: 1,
    fundName: 'FPV_BTG_PACTUAL_RECAUDADORA',
    type: 'SUBSCRIPTION',
    amount: 75000,
    notificationMethod: 'EMAIL',
    date: '2026-03-17T10:00:00.000Z'
  };

  const mockCancelTransaction: Transaction = {
    id: 'tx-002',
    fundId: 2,
    fundName: 'DEUDAPRIVADA',
    type: 'CANCEL',
    amount: 50000,
    notificationMethod: 'SMS',
    date: '2026-03-17T11:00:00.000Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsService);
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar con las transacciones vacías', () => {
    let result: Transaction[] = [];
    service.transactions$.subscribe(t => result = t);
    expect(result).toEqual([]);
  });

  it('debe agregar una transacción y emitirla', () => {
    let result: Transaction[] = [];
    service.transactions$.subscribe(t => result = t);

    service.add(mockTransaction);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockTransaction);
  });

  it('debe anteponer las nuevas transacciones (la más reciente primero)', () => {
    let result: Transaction[] = [];
    service.transactions$.subscribe(t => result = t);

    service.add(mockTransaction);
    service.add(mockCancelTransaction);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(mockCancelTransaction);
    expect(result[1]).toEqual(mockTransaction);
  });

  it('debe emitir la lista actualizada a todos los suscriptores', () => {
    const emissions: Transaction[][] = [];
    service.transactions$.subscribe(t => emissions.push([...t]));

    service.add(mockTransaction);
    service.add(mockCancelTransaction);

    expect(emissions.length).toBe(3);
    expect(emissions[0]).toEqual([]);
    expect(emissions[1].length).toBe(1);
    expect(emissions[2].length).toBe(2);
  });
});