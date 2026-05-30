import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {

  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request', () => {
    const mockData = { id: '1' };

    service.get<typeof mockData>('/test').subscribe((res: typeof mockData) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne('/test');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should make POST request', () => {
    const mockBody = { name: 'test' };
    const mockResponse = { id: '1', name: 'test' };

    service.post<typeof mockResponse>('/test', mockBody).subscribe((res: typeof mockResponse) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });

  it('should make PUT request', () => {
    const mockBody = { name: 'updated' };
    const mockResponse = { id: '1', name: 'updated' };

    service.put<typeof mockResponse>('/test/1', mockBody).subscribe((res: typeof mockResponse) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/test/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });

  it('should make DELETE request', () => {
    service.delete<void>('/test/1').subscribe();

    const req = httpMock.expectOne('/test/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});