import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { AREAS } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { SectionHeader } from '../ui/section-header';

/** Acceso directo a las tres áreas, justo después del hero. */
@Component({
  selector: 'kx-areas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Icon, Reveal],
  template: `
    <section class="section" aria-labelledby="areas-title">
      <div class="container">
        <kx-section-header eyebrow="Nuestro ecosistema">
          <h2 class="h2" id="areas-title">Tres áreas. Un mismo estudio.</h2>
        </kx-section-header>

        <ul class="grid">
          @for (area of areas; track area.href; let i = $index) {
            <li class="card area" kxReveal="up" [kxRevealDelay]="i * 60">
              <span class="icon" aria-hidden="true"
                ><kx-icon [name]="area.icon" [size]="22"
              /></span>
              <h3 class="h3">{{ area.title }}</h3>
              <p class="text">{{ area.text }}</p>
              <a class="link" [href]="area.href">
                {{ area.cta }}
                <kx-icon name="arrowRight" [size]="15" />
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    /* Es un puente entre el hero y Servicios: menos aire que una sección completa. */
    .section {
      padding-block: clamp(48px, 6vw, 88px);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
      gap: clamp(16px, 2.5vw, 28px);
      margin: clamp(2rem, 4vw, 3rem) 0 0;
      padding: 0;
      list-style: none;
    }

    .area {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      padding: clamp(20px, 2.5vw, 32px);
    }

    .icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--stroke);
      border-radius: var(--r-md);
      color: var(--accent-cool);
    }

    .text {
      margin: 0;
      color: var(--text-muted);
      flex: 1;
    }
  `,
})
export class Areas {
  protected readonly areas = AREAS;
}
