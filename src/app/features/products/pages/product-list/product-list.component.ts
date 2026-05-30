import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  itemsPerPage = 5;
  loading = false;
  errorMessage = '';
  selectedProduct: Product | null = null;
  showDeleteModal = false;
  currentPage = 1;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading = true;

    this.productService
      .getProducts()
      .subscribe({

        next: (products) => {

          this.products = products;

          this.filteredProducts = products;

          this.loading = false;
        },

        error: (error) => {

          this.errorMessage = error.message;

          this.loading = false;
        }
      });
  }

onSearch(event: Event): void {

  const value =
    (event.target as HTMLInputElement)
      .value
      .toLowerCase()
      .trim();

  this.currentPage = 1;

  this.filteredProducts =
    this.products.filter(product =>
      product.name
        .toLowerCase()
        .includes(value)
      ||
      product.description
        .toLowerCase()
        .includes(value)
      ||
      product.id
        .toLowerCase()
        .includes(value)
    );
}

onItemsPerPageChange(
  event: Event
): void {

  this.itemsPerPage = Number(
    (event.target as HTMLSelectElement)
      .value
  );

  this.currentPage = 1;
}

  openDeleteModal(
    product: Product
  ): void {

    this.selectedProduct = product;

    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {

    this.selectedProduct = null;

    this.showDeleteModal = false;
  }

  deleteProduct(): void {

    if (!this.selectedProduct) return;

    this.productService
      .deleteProduct(this.selectedProduct.id)
      .subscribe({

        next: () => {

          this.products =
            this.products.filter(
              product =>
                product.id !==
                this.selectedProduct?.id
            );

          this.filteredProducts =
            this.filteredProducts.filter(
              product =>
                product.id !==
                this.selectedProduct?.id
            );

          this.closeDeleteModal();
        },

        error: (error) => {
          alert(error.message);
        }
      });
  }

  trackByProduct(
    index: number,
    product: Product
  ): string {

    return product.id;
  }

  get paginatedProducts(): Product[] {

  const start =
    (this.currentPage - 1) *
    this.itemsPerPage;

  const end =
    start +
    this.itemsPerPage;

  return this.filteredProducts.slice(
    start,
    end
  );
}

get totalPages(): number {

  return Math.ceil(
    this.filteredProducts.length /
    this.itemsPerPage
  );
}

previousPage(): void {

  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage(): void {

  if (
    this.currentPage <
    this.totalPages
  ) {
    this.currentPage++;
  }
}

}

