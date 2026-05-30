import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  AsyncValidatorFn
} from '@angular/forms';
import {
  fakeAsync,
  tick
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { productIdValidator } from './product-id.validator';
import { ProductService } from '../../core/services/product.service';

describe('productIdValidator', () => {

  let productService: jasmine.SpyObj<ProductService>;
  let validator: AsyncValidatorFn;

  beforeEach(() => {
    productService = jasmine.createSpyObj('ProductService', [
      'verifyProductId'
    ]);

    validator = productIdValidator(productService);
  });

  it('should return null for empty value', fakeAsync(() => {
    const control = new FormControl('');
    let result: any;

    (validator(control) as any).subscribe((res: any) => {
      result = res;
    });

    tick(500);
    expect(result).toBeNull();
  }));

  it('should return productIdExists error when id exists', fakeAsync(() => {
    productService.verifyProductId.and.returnValue(of(true));

    const control = new FormControl('existing-id');
    let result: any;

    (validator(control) as any).subscribe((res: any) => {
      result = res;
    });

    tick(500);
    expect(result).toEqual({ productIdExists: true });
  }));

  it('should return null when id does not exist', fakeAsync(() => {
    productService.verifyProductId.and.returnValue(of(false));

    const control = new FormControl('new-id');
    let result: any;

    (validator(control) as any).subscribe((res: any) => {
      result = res;
    });

    tick(500);
    expect(result).toBeNull();
  }));

  it('should return null on error', fakeAsync(() => {
    productService.verifyProductId.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    const control = new FormControl('some-id');
    let result: any;

    (validator(control) as any).subscribe((res: any) => {
      result = res;
    });

    tick(500);
    expect(result).toBeNull();
  }));
});