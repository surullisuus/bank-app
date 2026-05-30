// product-list.component.spec.ts — reemplaza el tuyo completo
import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core/services/product.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../../shared/share.module';

describe('ProductListComponent', () => {

  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockProducts = [
    {
      id: 'uno',
      name: 'Producto Uno',
      description: 'Descripción producto',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    },
    {
      id: 'dos',
      name: 'Producto Dos',
      description: 'Otra descripción',
      logo: 'logo2.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01'
    }
  ];

  beforeEach(async () => {

    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'deleteProduct'
    ]);

    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    productServiceSpy.deleteProduct.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should set errorMessage on load error', () => {
    productService.getProducts.and.returnValue(
      throwError(() => new Error('Error de red'))
    );

    component.loadProducts();

    expect(component.errorMessage).toBe('Error de red');
    expect(component.loading).toBeFalse();
  });

  it('should filter products by name', () => {
    component.products = mockProducts;

    const event = {
      target: { value: 'Producto Uno' }
    } as unknown as Event;

    component.onSearch(event);

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe('uno');
  });

  it('should filter products case insensitive', () => {
    component.products = mockProducts;

    const event = {
      target: { value: 'PRODUCTO' }
    } as unknown as Event;

    component.onSearch(event);

    expect(component.filteredProducts.length).toBe(2);
  });

  it('should filter by description', () => {
    component.products = mockProducts;

    const event = {
      target: { value: 'otra descripción' }
    } as unknown as Event;

    component.onSearch(event);

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe('dos');
  });

  it('should filter by id', () => {
    component.products = mockProducts;

    const event = {
      target: { value: 'dos' }
    } as unknown as Event;

    component.onSearch(event);

    expect(component.filteredProducts.length).toBe(1);
  });

  it('should reset currentPage to 1 on search', () => {
    component.currentPage = 3;
    component.products = mockProducts;

    const event = {
      target: { value: 'producto' }
    } as unknown as Event;

    component.onSearch(event);

    expect(component.currentPage).toBe(1);
  });

  it('should open delete modal', () => {
    component.openDeleteModal(mockProducts[0]);

    expect(component.showDeleteModal).toBeTrue();
    expect(component.selectedProduct).toEqual(mockProducts[0]);
  });

  it('should close delete modal', () => {
    component.closeDeleteModal();

    expect(component.showDeleteModal).toBeFalse();
    expect(component.selectedProduct).toBeNull();
  });

  it('should delete product and update lists', () => {
    component.products = [...mockProducts];
    component.filteredProducts = [...mockProducts];
    component.selectedProduct = mockProducts[0];

    component.deleteProduct();

    expect(productService.deleteProduct).toHaveBeenCalledWith('uno');
    expect(component.products.length).toBe(1);
    expect(component.filteredProducts.length).toBe(1);
    expect(component.showDeleteModal).toBeFalse();
  });

  it('should not delete if selectedProduct is null', () => {
    component.selectedProduct = null;

    component.deleteProduct();

    expect(productService.deleteProduct).not.toHaveBeenCalled();
  });

  it('should show alert on delete error', () => {
    spyOn(window, 'alert');
    productService.deleteProduct.and.returnValue(
      throwError(() => new Error('Error al eliminar'))
    );

    component.selectedProduct = mockProducts[0];
    component.deleteProduct();

    expect(window.alert).toHaveBeenCalledWith('Error al eliminar');
  });

  it('should change items per page and reset currentPage', () => {
    component.currentPage = 2;

    const event = {
      target: { value: '10' }
    } as unknown as Event;

    component.onItemsPerPageChange(event);

    expect(component.itemsPerPage).toBe(10);
    expect(component.currentPage).toBe(1);
  });

  it('should track product by id', () => {
    const result = component.trackByProduct(0, mockProducts[0]);
    expect(result).toBe('uno');
  });

  it('should return paginated products', () => {
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 1;
    component.currentPage = 1;

    expect(component.paginatedProducts.length).toBe(1);
    expect(component.paginatedProducts[0].id).toBe('uno');
  });

  it('should return second page of paginated products', () => {
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 1;
    component.currentPage = 2;

    expect(component.paginatedProducts[0].id).toBe('dos');
  });

  it('should calculate totalPages correctly', () => {
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 1;

    expect(component.totalPages).toBe(2);
  });

  it('should go to previous page', () => {
    component.currentPage = 2;
    component.previousPage();

    expect(component.currentPage).toBe(1);
  });

  it('should not go below page 1', () => {
    component.currentPage = 1;
    component.previousPage();

    expect(component.currentPage).toBe(1);
  });

  it('should go to next page', () => {
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 1;
    component.currentPage = 1;

    component.nextPage();

    expect(component.currentPage).toBe(2);
  });

  it('should not exceed total pages', () => {
    component.filteredProducts = mockProducts;
    component.itemsPerPage = 1;
    component.currentPage = 2;

    component.nextPage();

    expect(component.currentPage).toBe(2);
  });
});