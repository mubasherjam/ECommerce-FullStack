import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product';
import { CategoryService } from '../../core/services/category';
import { Product } from '../../shared/models/product';
import { Category } from '../../shared/models/category';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  newsletterSubmitted = signal(false);

  featuredProducts = signal<Product[]>([]);
  productsLoading = signal(true);
  productsError = signal('');

  categories = signal<Category[]>([]);
  categoriesLoading = signal(true);

  totalProductCount = signal(0);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  loadFeaturedProducts(): void {

    this.productsLoading.set(true);
    this.productsError.set('');

    this.productService.getProducts().subscribe({

      next: (response) => {

        this.totalProductCount.set(response.length);

        const newest = [...response]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);

        this.featuredProducts.set(newest);

        this.productsLoading.set(false);
      },

      error: (error) => {

        console.error('Failed to load featured products:', error);

        this.productsError.set('Unable to load products right now.');

        this.productsLoading.set(false);
      }
    });
  }

  loadCategories(): void {

    this.categoriesLoading.set(true);

    this.categoryService.getCategories().subscribe({

      next: (response) => {

        this.categories.set(response.slice(0, 3));

        this.categoriesLoading.set(false);
      },

      error: (error) => {

        console.error('Failed to load categories:', error);

        this.categoriesLoading.set(false);
      }
    });
  }

  categoryImageSeed(categoryName: string): string {
    return categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  categoryQueryParams(category: Category): { category: number; categoryName: string } {
    return { category: category.id, categoryName: category.name };
  }

  categoryTagline(categoryName: string): { line1: string; line2: string } {

    const taglines: Record<string, { line1: string; line2: string }> = {
      'Electronics': { line1: 'Technology', line2: 'that works.' },
      'Clothing': { line1: 'Everyday', line2: 'essentials.' },
      'Home & Kitchen': { line1: 'Make space', line2: 'your own.' },
      'Books': { line1: 'Stories worth', line2: 'the read.' },
      'Sports & Outdoors': { line1: 'Built for', line2: 'the outdoors.' }
    };

    return taglines[categoryName] ?? { line1: categoryName, line2: 'and more.' };
  }

  submitNewsletter(): void {
    this.newsletterSubmitted.set(true);
  }
}