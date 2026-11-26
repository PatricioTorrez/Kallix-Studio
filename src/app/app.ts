import { ChangeDetectionStrategy, Component } from '@angular/core';
import { About } from './sections/about';
import { Areas } from './sections/areas';
import { Contact } from './sections/contact';
import { Cta } from './sections/cta';
import { Faq } from './sections/faq';
import { Games } from './sections/games';
import { Hero } from './sections/hero';
import { Pricing } from './sections/pricing';
import { Process } from './sections/process';
import { Products } from './sections/products';
import { Services } from './sections/services';
import { SiteFooter } from './sections/site-footer';
import { SiteHeader } from './sections/site-header';
import { Tech } from './sections/tech';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeader,
    Hero,
    Areas,
    Services,
    Products,
    Games,
    Tech,
    About,
    Pricing,
    Cta,
    Process,
    Faq,
    Contact,
    SiteFooter,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
