import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FundsService } from './funds.service';
import { Fund } from '../../shared/models/fund.model';

describe('FundsService', () => {
  let service: FundsService;
  let httpMock: HttpTestingController;

  const mockFunds: Fund[] = [
    { id: 1, name: 'FPV_BTG_PACTUAL_RECAUDADORA', minimumAmount: 75000, category: 'FPV' },
    { id: 2, name: 'FPV_BTG_PACTUAL_ECOPETROL', minimumAmount: 125000, category: 'FPV' },
    { id: 3, name: 'DEUDAPRIVADA', minimumAmount: 50000, category: 'FIC' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FundsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe retornar los fondos desde la API vía GET', () => {
    service.getFunds().subscribe(funds => {
      expect(funds.length).toBe(3);
      expect(funds).toEqual(mockFunds);
    });

    const req = httpMock.expectOne('http://localhost:3000/funds');
    expect(req.request.method).toBe('GET');
    req.flush(mockFunds);
  });

  it('debe propagar el error HTTP', () => {
    service.getFunds().subscribe({
      next: () => fail('debería haber fallado'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/funds');
    req.flush('Error del servidor', { status: 500, statusText: 'Internal Server Error' });
  });

  it('debe retornar un arreglo vacío cuando la API responde vacío', () => {
    service.getFunds().subscribe(funds => {
      expect(funds).toEqual([]);
      expect(funds.length).toBe(0);
    });

    const req = httpMock.expectOne('http://localhost:3000/funds');
    req.flush([]);
  });
});