import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SaleItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  discount: number;
}

export interface SaleCreate {
  customer_name: string;
  customer_phone?: string;
  customer_ntn_cnic?: string;
  customer_address?: string;
  customer_registration_type?: string;
  payment_method: string;
  discount_amount: number;
  items: SaleItem[];
}

export interface SaleResponse {
  id: number;
  invoice_number: string;
  fbr_invoice_number: string | null;
  customer_name: string;
  total_amount: number;
  tax_amount: number;
  grand_total: number;
  fbr_status: string;
  fbr_status_code: string | null;
  fbr_error_code: string | null;
  fbr_error_message: string | null;
  items: any[];
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8000/api/v1/sales/';   // ✅ ADD TRAILING SLASH

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createSale(saleData: SaleCreate): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.apiUrl, saleData, {
      headers: this.getHeaders()
    });
  }

  getSales(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getSale(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getTodayStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/today/stats`, {
      headers: this.getHeaders()
    });
  }
}