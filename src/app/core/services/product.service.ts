import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly baseUrl = `${environment.apiUrl}/bp/products`;

  constructor(private apiService: ApiService) { }

  getProducts(): Observable<Product[]> {
    return this.apiService
      .get<ApiResponse<Product[]>>(this.baseUrl)
      .pipe(
        map(response => response.data)
      );
  }

  getProductById(
    id: string
  ): Observable<Product> {

    return this.getProducts().pipe(

      map(products => {

        const product = products.find(
          p => p.id === id
        );

        if (!product) {
          throw new Error(
            'Product not found'
          );
        }

        return product;
      })
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.apiService
      .post<ApiResponse<Product>>(this.baseUrl, product)
      .pipe(
        map(response => response.data)
      );
  }

  updateProduct(
    id: string,
    product: Omit<Product, 'id'>
  ): Observable<Product> {

    return this.apiService
      .put<ApiResponse<Product>>(
        `${this.baseUrl}/${id}`,
        product
      )
      .pipe(
        map(response => response.data)
      );
  }

  deleteProduct(id: string): Observable<void> {
    return this.apiService
      .delete<void>(`${this.baseUrl}/${id}`);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.apiService
      .get<boolean>(
        `${this.baseUrl}/verification/${id}`
      );
  }
}

