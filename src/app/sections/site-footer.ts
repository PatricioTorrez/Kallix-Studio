import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, FOOTER_COLUMNS, SOCIAL_LINKS } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { Logo } from '../ui/logo';

@Component({
  selector: 'kx-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly columns = FOOTER_COLUMNS;
  protected readonly socials = SOCIAL_LINKS;
  protected readonly contact = CONTACT;
  protected readonly year = new Date().getFullYear();
}
