import { Routes } from '@angular/router';
import { LoginForm } from './components/login-form/login-form';
import { RegistrationForm } from './components/registration-form/registration-form';
import { LoginPage } from './components/pages/login-page/login-page';
import { RegisterPage } from './components/pages/register-page/register-page';
import { TeamsCard } from './components/teams-card/teams-card';
import { MainLayout } from './components/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';
import { TeamsPage } from './components/pages/teams-page/teams-page';
import { ProjectsPage } from './components/pages/projects-page/projects-page';
import { TaskBoardPage } from './components/pages/task-board-page/task-board-page';


export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    {
        path: '',
        component: MainLayout, 
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'teams', pathMatch: 'full' },
            { path: 'teams', component: TeamsPage },
            {path:'projects', component: ProjectsPage},
            {path:'teams/:id', component: ProjectsPage},
            { path:'projects/:projectId', component: TaskBoardPage },
            //{ path: 'teams/:id', component: TeamDetailComponent },
            // כאן תוכלי להוסיף בהמשך: projects/:id, tasks/:id וכו'
        ]
    }
];

