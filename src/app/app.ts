import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginForm } from './components/login-form/login-form';
import { RegistrationForm } from './components/registration-form/registration-form';
import { TeamsCard } from './components/teams-card/teams-card';
import { MainLayout } from "./components/main-layout/main-layout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('team-task-manager-client');
}
