import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  FbrScenarioService,
  FBRScenario,
  FBRScenarioTestResponse,
  ScenarioTestSummary,
  TestAllResult,
  TestAllResponse,
} from '../services/fbr-scenario.service';

@Component({
  selector: 'app-fbr-sandbox',
  standalone: false,
  templateUrl: './fbr-sandbox.component.html',
  styleUrls: ['./fbr-sandbox.component.scss'],
})
export class FbrSandboxComponent implements OnInit {
  scenarios: FBRScenario[] = [];
  selectedScenario: FBRScenario | null = null;
  testSummary: ScenarioTestSummary | null = null;
  loading = false;
  error = '';

  // Single-scenario test state
  testResult: FBRScenarioTestResponse | null = null;
  testingInProgress = false;
  showPayload = false;
  showResponse = false;

  // Run-all state
  runAllInProgress = false;
  runAllResults: TestAllResult[] | null = null;
  runAllSummary: { submitted: number; passed: number; failed: number } | null = null;

  constructor(
    private fbrScenarioService: FbrScenarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadScenarios();
    this.loadTestSummary();
  }

  // ── data loaders ──────────────────────────────────────────────────────────

  loadScenarios(): void {
    this.loading = true;
    this.fbrScenarioService.getScenarios(false).subscribe({
      next: (data) => {
        this.scenarios = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = `Failed to load scenarios: ${err.message || err.statusText || 'Unknown error'}`;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadTestSummary(): void {
    this.fbrScenarioService.getTestSummary().subscribe({
      next: (data) => {
        this.testSummary = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  // ── single scenario ───────────────────────────────────────────────────────

  selectScenario(scenario: FBRScenario): void {
    this.selectedScenario = scenario;
    this.testResult = null;
    this.error = '';
    this.showPayload = false;
    this.showResponse = false;
    this.cdr.detectChanges();
  }

  testScenario(): void {
    if (!this.selectedScenario) return;
    this.testingInProgress = true;
    this.error = '';
    this.testResult = null;
    this.cdr.detectChanges();

    this.fbrScenarioService
      .testScenario({ scenario_code: this.selectedScenario.scenario_code, use_sample_data: true })
      .subscribe({
        next: (response) => {
          this.testResult = response;
          this.testingInProgress = false;
          // Refresh list so status badge updates
          this.loadScenarios();
          this.loadTestSummary();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err?.error?.detail
            ? (Array.isArray(err.error.detail)
                ? err.error.detail.join('; ')
                : String(err.error.detail))
            : 'Failed to submit to FBR sandbox';
          this.testingInProgress = false;
          this.cdr.detectChanges();
        },
      });
  }

  // ── run all ───────────────────────────────────────────────────────────────

  runAll(): void {
    this.runAllInProgress = true;
    this.runAllResults = null;
    this.runAllSummary = null;
    this.error = '';
    this.cdr.detectChanges();

    this.fbrScenarioService.testAllScenarios().subscribe({
      next: (resp: TestAllResponse) => {
        this.runAllResults = resp.results;
        this.runAllSummary = { submitted: resp.submitted, passed: resp.passed, failed: resp.failed };
        this.runAllInProgress = false;
        this.loadScenarios();
        this.loadTestSummary();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.detail ?? 'Run-all failed';
        this.runAllInProgress = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── helpers ───────────────────────────────────────────────────────────────

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  pendingCount(): number {
    return this.scenarios.filter((s) => s.test_status !== 'Passed' && s.enabled).length;
  }

  passedCount(): number {
    return this.scenarios.filter((s) => s.test_status === 'Passed').length;
  }

  statusClass(status: string): string {
    if (status === 'Passed') return 'badge bg-success';
    if (status === 'Failed') return 'badge bg-danger';
    return 'badge bg-secondary';
  }

  progressPct(): number {
    if (!this.scenarios.length) return 0;
    return Math.round((this.passedCount() / this.scenarios.length) * 100);
  }
}
