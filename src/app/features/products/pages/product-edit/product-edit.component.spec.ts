import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ProductEditComponent
} from './product-edit.component';

import {
  ProductFormComponent
} from '../../components/product-form/product-form.component';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  RouterTestingModule
} from '@angular/router/testing';

import { of } from 'rxjs';
import { ProductService } from '../../../../core/services/product.service';


describe('ProductEditComponent', () => {

  let component: ProductEditComponent;

  let fixture:
    ComponentFixture<ProductEditComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        ProductEditComponent,
        ProductFormComponent
      ],

      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],

      providers: [
        {
          provide: ProductService,
          useValue: {

            verifyProductId:
              () => of(false),

            getProductById:
              () => of({
                id: 'uno',
                name: 'Producto Uno',
                description: 'Descripción producto',
                logo: 'logo.png',
                date_release: '2025-01-01',
                date_revision: '2026-01-01'
              }),

            updateProduct:
              () => of({})
          }
        }
      ]
    })
    .compileComponents();

    fixture =
      TestBed.createComponent(
        ProductEditComponent
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component)
      .toBeTruthy();
  });
});

