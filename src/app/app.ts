import { ChangeDetectionStrategy, Component } from '@angular/core';
import { About } from './sections/about';
import { Clients } from './sections/clients';
import { Contact } from './sections/contact';
import { Cta } from './sections/cta';
import { Faq } from './sections/faq';
import { Hero } from './sections/hero';
import { Portfolio } from './sections/portfolio';
import { Pricing } from './sections/pricing';
import { Process } from './sections/process';
import { Products } from './sections/products';
import { Services } from './sections/services';
import { SiteFooter } from './sections/site-footer';
import { SiteHeader } from './sections/site-header';
import { Stats } from './sections/stats';
import { Team } from './sections/team';
import { Tech } from './sections/tech';
import { Testimonials } from './sections/testimonials';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeader,
    Hero,
    Clients,
    About,
    Services,
    Tech,
    Products,
    Pricing,
    Portfolio,
    Cta,
    Process,
    Stats,
    Team,
    Testimonials,
    Faq,
    Contact,
    SiteFooter,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
