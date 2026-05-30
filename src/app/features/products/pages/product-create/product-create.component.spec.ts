import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ProductCreateComponent
} from './product-create.component';

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



describe('ProductCreateComponent', () => {

  let component: ProductCreateComponent;

  let fixture:
    ComponentFixture<ProductCreateComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        ProductCreateComponent,
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
              () => of({}),

            createProduct:
              () => of({})
          }
        }
      ]
    })
    .compileComponents();

    fixture =
      TestBed.createComponent(
        ProductCreateComponent
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

