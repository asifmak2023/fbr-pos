import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FBRScenario {
  id: number;
  scenario_code: string;
  name: string;
  description?: string;
  business_activity?: string;
  sector?: string;
  buyer_registration_type?: string;
  requires_buyer_ntn: boolean;
  requires_reference_invoice: boolean;
  sample_invoice_data?: any;
  enabled: boolean;
  test_status: string;
  required_fields?: string[];
  validation_rules?: any;
  created_at: string;
  updated_at?: string;
}

export interface FBRScenarioTestRequest {
  scenario_code: string;
  use_sample_data: boolean;
  custom_invoice_data?: any;
}

export interface FBRScenarioTestResponse {
  scenario_code: string;
  test_invoice_data: any;
  fbr_response?: any;
  test_status: string;
  error_message?: string;
  fbr_invoice_number?: string;
  submission_timestamp?: string;
}

export interface ScenarioTestSummary {
  total: number;
  not_tested: number;
  passed: number;
  failed: number;
  scenarios: Array<{
    scenario_code: string;
    name: string;
    test_status: string;
  }>;
}

export interface TestAllResult {
  scenario_code: string;
  name: string;
  test_status: string;
  fbr_invoice_number?: string;
  error_message?: string;
  fbr_response?: any;
  submission_timestamp?: string;
  _show?: boolean;
}

export interface TestAllResponse {
  submitted: number;
  passed: number;
  failed: number;
  results: TestAllResult[];
}

@Injectable({
  providedIn: 'root'
})
export class FbrScenarioService {
  private apiUrl = 'http://localhost:8000/api/v1/fbr-scenarios/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getScenarios(enabledOnly: boolean = false): Observable<FBRScenario[]> {
    const url = enabledOnly ? `${this.apiUrl}?enabled_only=true` : this.apiUrl;
    return this.http.get<FBRScenario[]>(url, { headers: this.getHeaders() });
  }

  getScenario(scenarioCode: string): Observable<FBRScenario> {
    return this.http.get<FBRScenario>(`${this.apiUrl}${scenarioCode}`, { headers: this.getHeaders() });
  }

  testScenario(testRequest: FBRScenarioTestRequest): Observable<FBRScenarioTestResponse> {
    return this.http.post<FBRScenarioTestResponse>(`${this.apiUrl}test`, testRequest, { headers: this.getHeaders() });
  }

  testAllScenarios(): Observable<TestAllResponse> {
    return this.http.post<TestAllResponse>(`${this.apiUrl}test-all`, {}, { headers: this.getHeaders() });
  }

  getTestSummary(): Observable<ScenarioTestSummary> {
    return this.http.get<ScenarioTestSummary>(`${this.apiUrl}status/summary`, { headers: this.getHeaders() });
  }

  updateScenario(scenarioCode: string, scenarioData: Partial<FBRScenario>): Observable<FBRScenario> {
    return this.http.put<FBRScenario>(`${this.apiUrl}${scenarioCode}`, scenarioData, { headers: this.getHeaders() });
  }
}
