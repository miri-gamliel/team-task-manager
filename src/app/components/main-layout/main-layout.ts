import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MatToolbar,RouterOutlet,RouterLink,MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,MatDivider],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  authService = inject(AuthService);

}
