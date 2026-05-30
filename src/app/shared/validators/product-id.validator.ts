import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';

import { Observable, of } from 'rxjs';

import {
  catchError,
  debounceTime,
  map,
  switchMap
} from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';



export function productIdValidator(
  productService: ProductService
): AsyncValidatorFn {

  return (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {

    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(

      debounceTime(500),

      switchMap(id =>

        productService
          .verifyProductId(id)
      ),

      map(exists =>

        exists
          ? { productIdExists: true }
          : null
      ),

      catchError(() => of(null))
    );
  };
}

