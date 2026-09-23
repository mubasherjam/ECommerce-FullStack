import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Navbar } from '../../shared/components/navbar/navbar';
import { ProductService } from '../../core/services/product';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Navbar,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  products: Product[] = [];

  loading = true;

  errorMessage = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {

    this.loading = true;

    this.errorMessage = '';

    this.productService
      .getProducts()
      .pipe(

        finalize(() => {

          this.loading = false;

          // Ensure Angular immediately updates
          // the Featured Products section.
          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response: Product[]) => {

          console.log(
            'HOME PRODUCTS:',
            response
          );

          /*
           * Sort products by CreatedAt.
           *
           * Newest product comes first.
           */
          this.products = response
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )

            /*
             * Only show the latest 4
             * products on the homepage.
             */
            .slice(0, 4);

        },

        error: (error) => {

          console.error(
            'HOME PRODUCT ERROR:',
            error
          );

          this.errorMessage =
            'Unable to load products.';

        }

      });
  }
}