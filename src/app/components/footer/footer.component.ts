import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-branding">
          <a routerLink="/" class="footer-logo">WriteSpace</a>
          <p class="footer-tagline">Your space to write, share, and inspire.</p>
        </div>

        <div class="footer-links">
          <div class="footer-links-column">
            <h4 class="footer-links-heading">Explore</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/blog">Blog</a></li>
              <li><a routerLink="/categories">Categories</a></li>
              <li><a routerLink="/authors">Authors</a></li>
            </ul>
          </div>

          <div class="footer-links-column">
            <h4 class="footer-links-heading">Company</h4>
            <ul>
              <li><a routerLink="/about">About</a></li>
              <li><a routerLink="/contact">Contact</a></li>
              <li><a routerLink="/privacy">Privacy Policy</a></li>
              <li><a routerLink="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">&copy; {{ currentYear }} WriteSpace. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background-color: #1a1a2e;
      color: #e0e0e0;
      padding: 3rem 1.5rem 1.5rem;
      margin-top: auto;
    }

    .footer-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      gap: 2rem;
    }

    .footer-branding {
      flex: 1 1 300px;
    }

    .footer-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: 0.5px;
    }

    .footer-logo:hover {
      color: #7c83ff;
    }

    .footer-tagline {
      margin-top: 0.5rem;
      font-size: 0.95rem;
      color: #a0a0b8;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 3rem;
    }

    .footer-links-column h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.75rem;
    }

    .footer-links-column ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links-column ul li {
      margin-bottom: 0.5rem;
    }

    .footer-links-column ul li a {
      color: #a0a0b8;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s ease;
    }

    .footer-links-column ul li a:hover {
      color: #7c83ff;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 2rem auto 0;
      padding-top: 1.5rem;
      border-top: 1px solid #2a2a4a;
      text-align: center;
    }

    .footer-copyright {
      font-size: 0.85rem;
      color: #a0a0b8;
      margin: 0;
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}