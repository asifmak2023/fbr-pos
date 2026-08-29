import { Component, OnInit } from '@angular/core';
import { FbrScenarioService, FBRScenario, FBRScenarioTestResponse, ScenarioTestSummary } from '../services/fbr-scenario.service';

@Component({
  selector: 'app-fbr-sandbox',
  templateUrl: './fbr-sandbox.component.html',
  styleUrls: ['./fbr-sandbox.component.scss']
})
export class FbrSandboxComponent implements OnInit {
  scenarios: FBRScenario[] = [];
  selectedScenario: FBRScenario | null = null;
  testSummary: ScenarioTestSummary | null = null;
  loading = false;
  error = '';
  
  // Test results
  testResults: FBRScenarioTestResponse | null = null;
  testingInProgress = false;

  constructor(private fbrScenarioService: FbrScenarioService) {}

  ngOnInit(): void {
    this.loadScenarios();
    this.loadTestSummary();
  }

  loadScenarios(): void {
    this.loading = true;
    this.fbrScenarioService.getScenarios(false).subscribe({
      next: (data) => {
        this.scenarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading scenarios:', err);
        this.error = 'Failed to load FBR scenarios';
        this.loading = false;
      }
    });
  }

  loadTestSummary(): void {
    this.fbrScenarioService.getTestSummary().subscribe({
      next: (data) => {
        this.testSummary = data;
      },
      error: (err) => {
        console.error('Error loading test summary:', err);
      }
    });
  }

  selectScenario(scenario: FBRScenario): void {
    this.selectedScenario = scenario;
    this.testResults = null;
    this.error = '';
  }

  testScenario(): void {
    if (!this.selectedScenario) {
      this.error = 'Please select a scenario first';
      return;
    }

    this.testingInProgress = true;
    this.error = '';
    this.testResults = null;

    this.fbrScenarioService.testScenario({
      scenario_code: this.selectedScenario.scenario_code,
      use_sample_data: true
    }).subscribe({
      next: (response) => {
        this.testResults = response;
        this.testingInProgress = false;
        this.loadTestSummary(); // Refresh summary after test
        this.loadScenarios(); // Refresh scenarios to get updated status
      },
      error: (err) => {
        console.error('Error testing scenario:', err);
        this.error = 'Failed to test scenario with FBR sandbox';
        this.testingInProgress = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Passed':
        return 'status-passed';
      case 'Failed':
        return 'status-failed';
      case 'Not Tested':
        return 'status-not-tested';
      default:
        return 'status-unknown';
    }
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  resetTest(): void {
    this.testResults = null;
    this.error = '';
  }
}