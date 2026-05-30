import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  Subject,
  takeUntil
} from 'rxjs';
import { OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { productIdValidator } from '../../../../shared/validators/product-id.validator';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  @Input() isEditMode = false;

  productForm!: FormGroup;

  today = new Date().toISOString().split('T')[0];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder, private router: Router, private productService: ProductService, private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {

    this.initializeForm();

    this.listenReleaseDateChanges();

    if (this.isEditMode) {

      this.disableIdField();

      this.loadProduct();
    }
  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }




  initializeForm(): void {

    this.productForm = this.fb.group({
      id: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)],
        [productIdValidator(this.productService)
        ]],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ],

      logo: [
        '',
        [
          Validators.required
        ]
      ],

      date_release: [
        '',
        [
          Validators.required
        ]
      ],

      date_revision: [
        {
          value: '',
          disabled: true
        },
        [
          Validators.required
        ]
      ]
    });
  }

  listenReleaseDateChanges(): void {

    this.productForm
      .get('date_release')
      ?.valueChanges.pipe(takeUntil(this.destroy$)).
      subscribe((value: string) => {
        if (!value) return;
        const releaseDate = new Date(value);
        releaseDate.setFullYear(releaseDate.getFullYear() + 1);
        const reviewDate = releaseDate.toISOString().split('T')[0];
        this.productForm.patchValue({ date_revision: reviewDate });
      });
  }

  disableIdField(): void {

    this.productForm
      .get('id')
      ?.disable();
  }



  loadProduct(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.productService
      .getProductById(id)
      .subscribe({

        next: (product) => {

          this.productForm.patchValue(
            product
          );
        },

        error: (error) => {
          alert(error.message);
        }
      });
  }


  onSubmit(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;
    }

    const product: Product =
      this.productForm.getRawValue();

    if (this.isEditMode) {

      const { id, ...payload } = product;

      this.productService
        .updateProduct(id, payload)
        .subscribe({
          next: () => {

            alert('Producto actualizado');

            this.router.navigate(['/products']);
          },

          error: (error) => {
            alert(error.message);
          }
        });

      return;
    }

    this.productService
      .createProduct(product)
      .subscribe({

        next: () => {

          alert('Producto creado');

          this.router.navigate(['/products']);
        },

        error: (error) => {
          alert(error.message);
        }
      });
  }



  onReset(): void {

    if (this.isEditMode) {

      const id =
        this.productForm.get('id')?.value;

      this.productForm.reset();

      this.productForm.patchValue({
        id
      });

      this.disableIdField();

      return;
    } else {

      this.productForm.reset();

      this.productForm.patchValue({
        date_revision: ''
      });
    }



  }


  getErrorMessage(controlName: string): string {

    const control = this.productForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (control.hasError('minlength')) {
      const required =
        control.getError('minlength').requiredLength;

      return `Debe tener mínimo ${required} caracteres`;
    }

    if (control.hasError('maxlength')) {
      const required =
        control.getError('maxlength').requiredLength;

      return `Debe tener máximo ${required} caracteres`;
    }

    if (control.hasError('productIdExists')) {
      return 'El ID ya existe';
    }

    if (control.hasError('invalidReleaseDate')) {
      return 'La fecha debe ser igual o posterior a hoy';
    }

    if (control.hasError('invalidReviewDate')) {
      return 'La fecha de revisión debe ser exactamente un año posterior';
    }

    return 'Campo inválido';
  }

  hasError(controlName: string): boolean {

    const control =
      this.productForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }

}

