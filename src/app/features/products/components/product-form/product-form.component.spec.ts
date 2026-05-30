import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  of,
  throwError
} from 'rxjs';

import {
  ProductFormComponent
} from './product-form.component';

import {
  ProductService
} from '../../../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';

describe('ProductFormComponent', () => {

  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {

    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'createProduct',
      'updateProduct',
      'verifyProductId',
      'getProductById'
    ]);

    productServiceSpy.createProduct.and.returnValue(of({}));
    productServiceSpy.updateProduct.and.returnValue(of({}));
    productServiceSpy.verifyProductId.and.returnValue(of(false));
    productServiceSpy.getProductById.and.returnValue(of({
      id: '1',
      name: 'test',
      description: 'test description',
      logo: 'logo',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    }));

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'products', component: ProductFormComponent }
        ])
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'test-id'
              }
            }
          }
        }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Creación e inicialización

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.productForm).toBeDefined();
  });

  it('should invalidate empty form', () => {
    expect(component.productForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.productForm;

    form.patchValue({
      id: '',
      name: '',
      description: '',
      logo: ''
    });

    expect(form.invalid).toBeTrue();
  });

  it('should validate form correctly', fakeAsync(() => {
    const idControl = component.productForm.get('id');
    idControl?.clearAsyncValidators();
    idControl?.updateValueAndValidity();

    component.productForm.patchValue({
      id: 'uno',
      name: 'Producto Uno',
      description: 'Descripción válida producto',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });

    tick(500);
    fixture.detectChanges();

    expect(component.productForm.valid).toBeTrue();
  }));

  // Fechas

  it('should calculate review date', () => {
    component.productForm
      .get('date_release')
      ?.setValue('2025-01-01');

    expect(
      component.productForm.get('date_revision')?.value
    ).toBe('2026-01-01');
  });

  it('should set review date when release date changes', () => {
    component.productForm
      .get('date_release')
      ?.setValue('2025-01-01');

    expect(
      component.productForm.get('date_revision')?.value
    ).toBeTruthy();
  });

  it('should not update review date when value is empty', () => {
    component.productForm
      .get('date_release')
      ?.setValue('');

    expect(
      component.productForm.get('date_revision')?.value
    ).toBe('');
  });

  //   Campo id  

  it('should disable id field', () => {
    component.disableIdField();

    expect(
      component.productForm.get('id')?.disabled
    ).toBeTrue();
  });

  //   Reset  

  it('should reset form', () => {
    component.productForm.patchValue({ id: 'uno' });

    component.onReset();

    expect(
      component.productForm.get('id')?.value
    ).toBeNull();
  });

  it('should reset form in edit mode keeping id', () => {
    component.isEditMode = true;

    component.productForm.patchValue({
      id: '123',
      name: 'Test',
      description: 'Test desc',
      logo: 'logo'
    });

    component.onReset();

    expect(
      component.productForm.get('id')?.value
    ).toBe('123');
  });

  it('should reset form in create mode', () => {
    component.isEditMode = false;

    component.productForm.patchValue({
      id: '123',
      name: 'Test'
    });

    component.onReset();

    expect(
      component.productForm.get('id')?.value
    ).toBeNull();
  });

  //   hasError  

  it('should return invalid field', () => {
    const control = component.productForm.get('name');

    control?.markAsTouched();
    control?.setValue('');

    expect(component.hasError('name')).toBeTrue();
  });

  //   getErrorMessage  

  it('should return empty string when control not touched', () => {
    expect(component.getErrorMessage('name')).toBe('');
  });

  it('should return required error message', () => {
    const control = component.productForm.get('id');
    control?.setErrors({ required: true });
    control?.markAsTouched();

    expect(component.getErrorMessage('id')).toContain('obligatorio');
  });

  it('should return minlength error message', () => {
    const control = component.productForm.get('name');
    control?.setErrors({ minlength: { requiredLength: 5 } });
    control?.markAsTouched();

    expect(component.getErrorMessage('name')).toContain('mínimo');
  });

  it('should return maxlength error message', () => {
    const control = component.productForm.get('name');
    control?.setErrors({ maxlength: { requiredLength: 100 } });
    control?.markAsTouched();

    expect(component.getErrorMessage('name')).toContain('máximo');
  });

  it('should return productIdExists error message', () => {
    const control = component.productForm.get('id');
    control?.setErrors({ productIdExists: true });
    control?.markAsTouched();

    expect(component.getErrorMessage('id')).toBe('El ID ya existe');
  });

  it('should return invalidReleaseDate error message', () => {
    const control = component.productForm.get('date_release');
    control?.setErrors({ invalidReleaseDate: true });
    control?.markAsTouched();

    expect(component.getErrorMessage('date_release'))
      .toContain('posterior a hoy');
  });

  it('should return invalidReviewDate error message', () => {
    const control = component.productForm.get('date_revision');
    control?.enable();
    control?.setErrors({ invalidReviewDate: true });
    control?.markAsTouched();

    expect(component.getErrorMessage('date_revision'))
      .toContain('un año posterior');
  });

  it('should return fallback error message', () => {
    const control = component.productForm.get('name');
    control?.setErrors({ unknownError: true });
    control?.markAsTouched();

    expect(component.getErrorMessage('name')).toBe('Campo inválido');
  });

  //   Submit inválido  

  it('should mark form as touched on invalid submit', () => {
    spyOn(component.productForm, 'markAllAsTouched');

    component.onSubmit();

    expect(
      component.productForm.markAllAsTouched
    ).toHaveBeenCalled();
  });

  it('should mark all as touched on invalid submit', () => {
    spyOn(component.productForm, 'markAllAsTouched');

    component.productForm.patchValue({ id: '' });

    component.onSubmit();

    expect(
      component.productForm.markAllAsTouched
    ).toHaveBeenCalled();
  });

  //   Submit createProduct  

  it('should call createProduct on submit', fakeAsync(() => {
    component.isEditMode = false;

    const idControl = component.productForm.get('id');
    idControl?.clearAsyncValidators();
    idControl?.updateValueAndValidity();

    component.productForm.patchValue({
      id: 'uno',
      name: 'Producto Uno',
      description: 'Descripción válida producto',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });

    tick(500);
    fixture.detectChanges();

    component.onSubmit();

    expect(productService.createProduct).toHaveBeenCalled();
  }));

  it('should show alert on createProduct error', fakeAsync(() => {
    spyOn(window, 'alert');
    productService.createProduct.and.returnValue(
      throwError(() => new Error('Error al crear'))
    );

    component.isEditMode = false;

    const idControl = component.productForm.get('id');
    idControl?.clearAsyncValidators();
    idControl?.updateValueAndValidity();

    component.productForm.patchValue({
      id: 'abc',
      name: 'test nombre',
      description: 'test description valida',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });

    tick(500);
    fixture.detectChanges();

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error al crear');
  }));

  //   Submit updateProduct  

  it('should call updateProduct on submit', fakeAsync(() => {
    component.isEditMode = true;
    component.productForm.get('id')?.disable();

    component.productForm.patchValue({
      name: 'Producto Uno',
      description: 'Descripción válida producto',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });

    tick(500);
    fixture.detectChanges();

    component.onSubmit();

    expect(productService.updateProduct).toHaveBeenCalled();
  }));

  it('should show alert on updateProduct error', fakeAsync(() => {
    spyOn(window, 'alert');
    productService.updateProduct.and.returnValue(
      throwError(() => new Error('Error al actualizar'))
    );

    component.isEditMode = true;
    component.productForm.get('id')?.disable();

    component.productForm.patchValue({
      name: 'test nombre',
      description: 'test description valida',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });

    tick(500);
    fixture.detectChanges();

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error al actualizar');
  }));

  //   loadProduct  

  it('should load product in edit mode', fakeAsync(() => {
    component.isEditMode = true;
    component.ngOnInit();

    tick(500);
    fixture.detectChanges();

    expect(productService.getProductById).toHaveBeenCalledWith('test-id');
  }));

  it('should show alert on loadProduct error', fakeAsync(() => {
    spyOn(window, 'alert');
    productService.getProductById.and.returnValue(
      throwError(() => new Error('Producto no encontrado'))
    );

    component.isEditMode = true;
    component.ngOnInit();

    tick(500);
    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('Producto no encontrado');
  }));

  //   ngOnDestroy  

  it('should call ngOnDestroy and complete destroy$', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

});