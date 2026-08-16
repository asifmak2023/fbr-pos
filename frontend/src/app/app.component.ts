import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false   // <-- ADD THIS LINE
})
export class AppComponent {
  title = 'frontend';
}