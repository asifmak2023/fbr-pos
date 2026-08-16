import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../services/product.service';

import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string = '';
  displayedColumns: string[] = ['id', 'sku', 'name', 'selling_price', 'quantity', 'actions'];

  constructor(
  private productService: ProductService,
  private dialog: MatDialog
) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error(err);
      }
    });
  }

  

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          alert('Failed to delete product');
          console.error(err);
        }
      });
    }
  }

  openAddProduct(): void {
  const dialogRef = this.dialog.open(ProductFormDialogComponent, {
    width: '500px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadProducts();
    }
  });
}

editProduct(id: number): void {
  this.productService.getProduct(id).subscribe(product => {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: { product }
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadProducts();
    }
   });
  });
}

}

