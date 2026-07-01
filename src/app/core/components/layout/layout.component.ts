import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { NavComponent } from '../nav/nav.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // ← ajouter cette ligne
})
export class LayoutComponent {
  authService = inject(AuthService);
}
