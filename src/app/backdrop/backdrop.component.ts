import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backdrop',
  standalone: true,
  imports: [],
  templateUrl: './backdrop.component.html',
  styleUrl: './backdrop.component.scss',
})
export class BackdropComponent {
  constructor(private router: Router) {}

  onBackdropClick() {
    this.router.navigate(['/']);
  }
}
