import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Re-evaluate login state and active route on every completed navigation.
    // This ensures the navbar appears immediately after the login redirect
    // without needing a full page reload.
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute = e.urlAfterRedirects ?? e.url;
        this.isLoggedIn = !!localStorage.getItem('token');
      });

    // Also check immediately for the initial load.
    this.isLoggedIn = !!localStorage.getItem('token');
    this.currentRoute = this.router.url;
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}
