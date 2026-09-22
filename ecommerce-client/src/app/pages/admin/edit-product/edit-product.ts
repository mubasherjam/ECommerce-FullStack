import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { CategoryService } from '../../../core/services/category';
import { Category } from '../../../shared/models/category';
import { ProductRequest } from '../../../shared/models/product-request';

@Component({
  selector: 'app-edit-product',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {

  productId!: number;

  form: ProductRequest = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: 0
  };

  categories = signal<Category[]>([]);
  categoriesLoading = signal(true);
  categoriesError = signal('');

  loading = signal(true);
  loadError = signal('');

  submitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {

    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadCategories();
    this.loadProduct();
  }

  loadCategories(): void {

    this.categoriesLoading.set(true);
    this.categoriesError.set('');

    this.categoryService.getCategories().subscribe({

      next: (response) => {

        this.categories.set(response);

        this.categoriesLoading.set(false);
      },

      error: (error) => {

        console.error('Failed to load categories:', error);

        this.categoriesError.set('Unable to load categories.');

        this.categoriesLoading.set(false);
      }
    });
  }

  loadProduct(): void {

    this.loading.set(true);
    this.loadError.set('');

    this.productService.getProduct(this.productId).subscribe({

      next: (product) => {

        this.form = {
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          stockQuantity: product.stockQuantity,
          imageUrl: product.imageUrl ?? '',
          categoryId: product.categoryId
        };

        this.loading.set(false);
      },

      error: (error) => {

        console.error('Failed to load product:', error);

        this.loadError.set('Unable to load this product.');

        this.loading.set(false);
      }
    });
  }

  submit(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.form.categoryId) {
      this.errorMessage.set('Please select a category.');
      return;
    }

    this.submitting.set(true);

    this.productService.updateProduct(this.productId, this.form).subscribe({

      next: () => {

        this.successMessage.set('Product updated successfully.');

        this.submitting.set(false);

        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1000);
      },

      error: (error) => {

        console.error('Failed to update product:', error);

        this.errorMessage.set(error.error || 'Unable to update this product.');

        this.submitting.set(false);
      }
    });
  }
}