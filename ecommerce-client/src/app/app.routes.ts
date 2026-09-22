import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { ProductDetails } from './pages/product-details/product-details';
import { AddProduct } from './pages/admin/add-product/add-product';
import { ManageProducts } from './pages/admin/manage-products/manage-products';
import { EditProduct } from './pages/admin/edit-product/edit-product';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'products',
    component: Products
  },
  {
    path: 'products/:id',
    component: ProductDetails
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: Orders,
    canActivate: [authGuard]
  },
  {
    path: 'admin/products/new',
    component: AddProduct,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/products',
    component: ManageProducts,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/products/edit/:id',
    component: EditProduct,
    canActivate: [authGuard, adminGuard]
  }

];