import { Routes } from '@angular/router';
import { GuardService } from './core/guards/guard.service';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent) },

  { path: 'category', loadComponent: () => import('./features/category/category.component').then(m => m.CategoryComponent),
    canActivate: [GuardService],
    data: { requiresAdmin: true }
  },
  /* Supplier */
  { path: 'supplier', loadComponent: () => import('./features/supplier/supplier.component').then(m => m.SupplierComponent),
    canActivate: [GuardService],
    data: { requiresAdmin: true }
  },
  { path: 'edit-supplier/:supplierId', loadComponent: () => import('./features/add-edit-supplier/add-edit-supplier.component').then(m => m.AddEditSupplierComponent),
    canActivate: [GuardService],
    data: { requiresAdmin: true }
  },
  { path: 'add-supplier', loadComponent: () => import('./features/add-edit-supplier/add-edit-supplier.component').then(m => m.AddEditSupplierComponent),
    canActivate: [GuardService],
    data: { requiresAdmin: true }
  },
  /* Product */
  { path: 'product', loadComponent: () => import('./features/product/product.component').then(m => m.ProductComponent),
    canActivate: [GuardService],
    data: { requiresAdmin: true }
  },
  { path: 'edit-product/:productId', loadComponent: () => import('./features/add-edit-product/add-edit-product.component').then(m => m.AddEditProductComponent),
    canActivate: [GuardService],
    data: { requiresAdmin: true }
  },
  { path: 'add-product', loadComponent: () => import('./features/add-edit-product/add-edit-product.component').then(m => m.AddEditProductComponent),
    canActivate: [GuardService],
    data: { requiresAdmin: true }
  },
  /* Purchase, sell, transaction */
  { path: 'purchase', loadComponent: () => import('./features/purchase/purchase.component').then(m => m.PurchaseComponent),
    canActivate: [GuardService]
  },
  { path: 'sell', loadComponent: () => import('./features/sell/sell.component').then(m => m.SellComponent),
    canActivate: [GuardService]
  },
  { path: 'transaction', loadComponent: () => import('./features/transaction/transaction.component').then(m => m.TransactionComponent),
    canActivate: [GuardService]
  },
  { path: 'transaction/:transactionId', loadComponent: () => import('./features/transaction-details/transaction-details.component').then(m => m.TransactionDetailsComponent),
    canActivate: [GuardService]
  },
  /* Profile, dashboard */
  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [GuardService]
  },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [GuardService]
  },

  /* Wide card */
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }

];
