import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { SaleService, SaleCreate } from '../services/sale.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
  standalone: false
})
export class PosComponent implements OnInit {
  searchTerm: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cartItems: { product: Product, quantity: number, unit_price: number }[] = [];
  customerName: string = '';
  customerPhone: string = '';
  customerNTN: string = '';
  customerAddress: string = '';
  customerRegistrationType: string = 'Unregistered';
  paymentMethod: string = 'Cash';
  discountAmount: number = 0;
  subtotal: number = 0;
  taxAmount: number = 0;
  grandTotal: number = 0;
  loading: boolean = false;
  error: string = '';

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    public router: Router,
    private cdr: ChangeDetectorRef   // <-- ADD THIS
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('✅ POS Products received:', data);
        this.products = data;
        this.filteredProducts = data;
        this.cdr.detectChanges();   // <-- FORCE VIEW UPDATE
        console.log('✅ filteredProducts set to:', this.filteredProducts.length, 'items');
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products';
        this.cdr.detectChanges();
      }
    });
  }

  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      );
    }
    this.cdr.detectChanges();
  }

  addToCart(product: Product): void {
    const existing = this.cartItems.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1, unit_price: product.selling_price });
    }
    this.updateTotals();
    this.cdr.detectChanges();
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateTotals();
    this.cdr.detectChanges();
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(index);
      return;
    }
    this.cartItems[index].quantity = quantity;
    this.updateTotals();
    this.cdr.detectChanges();
  }

  updateTotals(): void {
    this.subtotal = 0;
    this.taxAmount = 0;
    for (const item of this.cartItems) {
      const itemTotal = item.quantity * item.unit_price;
      this.subtotal += itemTotal;
      const taxRate = item.product.tax_rate ? parseFloat(item.product.tax_rate) / 100 : 0.18;
      this.taxAmount += itemTotal * taxRate;
    }
    this.grandTotal = this.subtotal + this.taxAmount - this.discountAmount;
  }

  onDiscountChange(): void {
    this.updateTotals();
    this.cdr.detectChanges();
  }

  createSale(): void {
    if (!this.customerName.trim()) {
      this.error = 'Customer name is required';
      this.cdr.detectChanges();
      return;
    }
    if (this.cartItems.length === 0) {
      this.error = 'Add at least one product';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const saleData: SaleCreate = {
      customer_name: this.customerName,
      customer_phone: this.customerPhone || undefined,
      customer_ntn_cnic: this.customerNTN || undefined,
      customer_address: this.customerAddress || undefined,
      customer_registration_type: this.customerRegistrationType,
      payment_method: this.paymentMethod,
      discount_amount: this.discountAmount,
      items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: 0
      }))
    };

    this.saleService.createSale(saleData).subscribe({
      next: (response) => {
        this.loading = false;
        alert(`✅ Sale Created!\nInvoice: ${response.invoice_number}\nFBR Status: ${response.fbr_status}\nTotal: PKR ${response.grand_total.toFixed(2)}`);
        this.cartItems = [];
        this.customerName = '';
        this.customerPhone = '';
        this.customerNTN = '';
        this.customerAddress = '';
        this.discountAmount = 0;
        this.updateTotals();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error creating sale:', err);
        this.error = 'Failed to create sale. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}