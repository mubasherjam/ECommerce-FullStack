import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { CategoryService } from '../../../core/services/category';
import { Category } from '../../../shared/models/category';
import { ProductRequest } from '../../../shared/models/product-request';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {

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

  submitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
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

  submit(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.form.categoryId) {
      this.errorMessage.set('Please select a category.');
      return;
    }

    this.submitting.set(true);

    this.productService.createProduct(this.form).subscribe({

      next: (product) => {

        this.successMessage.set(`"${product.name}" was added successfully.`);

        this.submitting.set(false);

        this.resetForm();
      },

      error: (error) => {

        console.error('Failed to create product:', error);

        this.errorMessage.set(error.error || 'Unable to create this product.');

        this.submitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.form = {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: '',
      categoryId: 0
    };
  }
}