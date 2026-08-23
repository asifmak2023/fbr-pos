import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef   // <-- ADD THIS
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Products received:', data);
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();   // <-- FORCE VIEW UPDATE
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();   // <-- FORCE VIEW UPDATE
      }
    });
  }

  openAddProduct(): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        const dialogRef = this.dialog.open(ProductFormDialogComponent, {
          width: '550px',
          data: { product }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadProducts();
          }
        });
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        alert('Failed to load product details.');
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
          console.error('Error deleting product:', err);
          alert('Failed to delete product.');
        }
      });
    }
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }
}