import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService, Product } from '../services/product.service';

@Component({
  selector: 'app-product-form-dialog',
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.scss'],
  standalone: false
})
export class ProductFormDialogComponent {
  product: Partial<Product> = {
    sku: '',
    name: '',
    selling_price: 0,
    quantity: 0,
    hs_code: '',
    tax_rate: '18%',
    uom: 'Pieces',
  };
  isEdit: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product },
    private productService: ProductService
  ) {
    if (data && data.product) {
      this.isEdit = true;
      this.product = { ...data.product };
    }
  }

  onSubmit(): void {
    if (!this.product.sku || !this.product.name) {
      this.error = 'SKU and Name are required';
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isEdit && this.product.id) {
      this.productService.updateProduct(this.product.id, this.product).subscribe({
        next: (updated) => {
          this.dialogRef.close(updated);
        },
        error: (err) => {
          this.error = 'Failed to update product';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: (created) => {
          this.dialogRef.close(created);
        },
        error: (err) => {
          this.error = 'Failed to create product';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}