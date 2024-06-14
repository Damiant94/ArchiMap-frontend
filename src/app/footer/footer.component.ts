import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  onGithubClick() {
    window.open('https://github.com/Damiant94', '_blank');
  }

  onLinkedinClick() {
    window.open('https://www.linkedin.com/in/damiantulacz/', '_blank');
  }
}
