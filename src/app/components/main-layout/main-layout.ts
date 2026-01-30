import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet, 
    RouterLink,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule,
    MatDivider,
    MatTooltipModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  standalone: true
})
export class MainLayout {
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
  if (this.authService.getToken() && !this.authService.curruntUser()) {
    this.authService.loadMe().subscribe({ error: () => {/* שקט או לוג */} });
  }
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}