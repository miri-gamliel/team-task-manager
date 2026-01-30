import { Component } from '@angular/core';
import { TeamsCard } from "../../teams-card/teams-card";

@Component({
  selector: 'app-teams-page',
  imports: [TeamsCard],
  templateUrl: './teams-page.html',
  styleUrl: './teams-page.css',
  standalone: true
})
export class TeamsPage {}