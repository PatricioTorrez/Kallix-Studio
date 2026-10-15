import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reveal } from '../core/reveal.directive';
import { CONTACT } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { PixelSprite } from '../ui/pixel-sprite';
import { SectionHeader } from '../ui/section-header';

/**
 * El formulario se entrega con FormSubmit (https://formsubmit.co): sin cuenta ni clave,
 * reenvía cada envío al buzón de la URL. Se usa el alias aleatorio de patriciotzdz@gmail.com
 * para no publicar el correo en el bundle. FormSubmit activa por dominio: cada dominio
 * nuevo manda un correo de activación antes de entregar. Vacío = envío simulado.
 */
const FORMSUBMIT_INBOX = '0d78b8ea3b6cc0009aedae7986b81848';
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_INBOX}`;

const DEFAULTS = { kind: 'Sistema SaaS', budget: 'Por definir', privacy: false };

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'kx-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SectionHeader, Icon, PixelSprite, Reveal],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly contact = CONTACT;
  protected readonly state = signal<SubmitState>('idle');
  protected readonly submitted = signal(false);

  protected readonly kinds = ['Sistema SaaS', 'App Android', 'ChatBot', 'Otro'];
  protected readonly budgets = ['< 5k', '5k – 15k', '15k – 40k', '40k +', 'Por definir'];

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    kind: [DEFAULTS.kind, Validators.required],
    budget: [DEFAULTS.budget],
    message: ['', [Validators.required, Validators.minLength(20)]],
    privacy: [DEFAULTS.privacy, Validators.requiredTrue],
    // Honeypot: invisible para personas; si un bot lo rellena, FormSubmit descarta el envío.
    honey: [''],
  });

  protected invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  protected async send(): Promise<void> {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstError();
      return;
    }

    this.state.set('sending');

    try {
      if (FORMSUBMIT_INBOX) {
        const { name, email, company, kind, budget, message, honey } = this.form.getRawValue();
        const response = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `Nuevo proyecto · ${kind} · ${name}`,
            _replyto: email,
            _template: 'table',
            _captcha: 'false',
            _honey: honey,
            Nombre: name,
            Correo: email,
            Empresa: company || '—',
            Proyecto: kind,
            Presupuesto: budget,
            Mensaje: message,
          }),
        });
        // FormSubmit responde `success` como cadena ("true"/"false"), no como booleano.
        const result = (await response.json().catch(() => null)) as {
          success?: boolean | string;
        } | null;
        if (!response.ok || String(result?.success) !== 'true') {
          throw new Error(`HTTP ${response.status}`);
        }
      } else {
        // Sin buzón configurado: se simula la latencia para poder ver los estados.
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      this.state.set('success');
      this.form.reset(DEFAULTS);
      this.submitted.set(false);
    } catch {
      this.state.set('error');
    }
  }

  protected reset(): void {
    this.state.set('idle');
  }

  private focusFirstError(): void {
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('#contacto [aria-invalid="true"]')
        ?.focus({ preventScroll: false });
    });
  }
}
