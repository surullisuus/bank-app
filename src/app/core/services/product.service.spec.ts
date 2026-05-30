import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ProductService
} from './product.service';
import { environment } from '../../../environments/environment';


describe('ProductService', () => {

  let service: ProductService;

  let httpMock:
    HttpTestingController;

  const apiUrl =
    `${environment.apiUrl}/bp/products`;

  beforeEach(() => {

    TestBed.configureTestingModule({

      imports: [
        HttpClientTestingModule
      ]
    });

    service =
      TestBed.inject(ProductService);

    httpMock =
      TestBed.inject(
        HttpTestingController
      );
  });

  afterEach(() => {

    httpMock.verify();
  });

  it('should be created', () => {

    expect(service)
      .toBeTruthy();
  });

  it('should get products', () => {

const mockResponse = [
  {
    id: 'uno',
    name: 'Producto Uno',
    description: 'Descripción producto',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  }
];
    service
      .getProducts()
      .subscribe((response) => {

        expect(response)
          .toEqual(mockResponse);
      });

    const req =
      httpMock.expectOne(apiUrl);

    expect(req.request.method)
      .toBe('GET');

    req.flush(mockResponse);
  });

  it('should create product', () => {

    const mockProduct = {
      id: 'uno'
    };

    service
      .createProduct(mockProduct as any)
      .subscribe();

    const req =
      httpMock.expectOne(apiUrl);

    expect(req.request.method)
      .toBe('POST');

    req.flush(mockProduct);
  });

  it('should update product', () => {

    const mockProduct = {
      name: 'Updated'
    };

    service
      .updateProduct(
        'uno',
        mockProduct as any
      )
      .subscribe();

    const req =
      httpMock.expectOne(
        `${apiUrl}/uno`
      );

    expect(req.request.method)
      .toBe('PUT');

    req.flush(mockProduct);
  });

  it('should delete product', () => {

    service
      .deleteProduct('uno')
      .subscribe();

    const req =
      httpMock.expectOne(
        `${apiUrl}/uno`
      );

    expect(req.request.method)
      .toBe('DELETE');

    req.flush({});
  });

  it('should verify product id', () => {

    service
      .verifyProductId('uno')
      .subscribe();

    const req =
      httpMock.expectOne(
        `${apiUrl}/verification/uno`
      );

    expect(req.request.method)
      .toBe('GET');

    req.flush(true);
  });

  it('should get product by id', () => {

    service
      .getProductById('uno')
      .subscribe();

    const req =
      httpMock.expectOne(apiUrl);

    expect(req.request.method)
      .toBe('GET');

    req.flush([
      {
        id: 'uno'
      }
    ]);
  });

  it('should get product by id when exists', () => {
  const mockProducts = [
    {
      id: 'uno',
      name: 'Producto Uno',
      description: 'Descripción producto',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    }
  ];

  service.getProductById('uno').subscribe(product => {
    expect(product.id).toBe('uno');
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/bp/products`);
  req.flush({ data: mockProducts });
});

it('should throw error when product not found', () => {
  let errorThrown = false;

  service.getProductById('no-existe').subscribe({
    error: (err) => {
      errorThrown = true;
      expect(err.message).toBe('Product not found');
    }
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/bp/products`);
  req.flush({ data: [] });

  expect(errorThrown).toBeTrue();
});
});

