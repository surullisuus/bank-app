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
  of
} from 'rxjs';

import {
  ProductFormComponent
} from './product-form.component';

import {
  ProductService
} from '../../../../core/services/product.service';

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
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
    const form = component.productForm;

    const idControl = form.get('id');
    idControl?.clearAsyncValidators();
    idControl?.updateValueAndValidity();

    form.patchValue({
      id: 'uno',
      name: 'Producto Uno',
      description: 'Descripción válida producto',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });

    tick(500);
    fixture.detectChanges();

    expect(form.valid).toBeTrue();
  }));

  it('should calculate review date', () => {
    component.productForm
      .get('date_release')
      ?.setValue('2025-01-01');

    expect(
      component.productForm.get('date_revision')?.value
    ).toBe('2026-01-01');
  });

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

  it('should disable id field in edit mode', () => {
    component.disableIdField();

    expect(
      component.productForm.get('id')?.disabled
    ).toBeTrue();
  });

  it('should disable id field', () => {
    component.disableIdField();

    expect(
      component.productForm.get('id')?.disabled
    ).toBeTrue();
  });

  it('should return invalid field', () => {
    const control = component.productForm.get('name');

    control?.markAsTouched();
    control?.setValue('');

    expect(component.hasError('name')).toBeTrue();
  });

  it('should set review date when release date changes', () => {
    component.productForm
      .get('date_release')
      ?.setValue('2025-01-01');

    expect(
      component.productForm.get('date_revision')?.value
    ).toBeTruthy();
  });

  it('should return required error message', () => {
    const control = component.productForm.get('id');

    control?.setErrors({ required: true });
    control?.markAsTouched();

    expect(
      component.getErrorMessage('id')
    ).toContain('obligatorio');
  });

  // ── Submit tests con fakeAsync para manejar el validador asíncrono ──

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

  it('should call updateProduct on submit', fakeAsync(() => {
    component.isEditMode = true;

    // En edit mode el id se deshabilita, el validador asíncrono no corre
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

});