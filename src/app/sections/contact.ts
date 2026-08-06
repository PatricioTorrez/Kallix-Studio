import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reveal } from '../core/reveal.directive';
import { CONTACT } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { PixelSprite } from '../ui/pixel-sprite';
import { SectionHeader } from '../ui/section-header';

/**
 * Endpoint del formulario. Vacío = envío simulado (útil en desarrollo).
 * Pon aquí tu backend o un servicio tipo Formspree y no hay nada más que tocar.
 */
const CONTACT_ENDPOINT = '';

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

  protected readonly kinds = ['Web', 'Móvil', 'SaaS', 'IA / ChatBot', 'Automatización', 'Otro'];
  protected readonly budgets = ['< 5k', '5k – 15k', '15k – 40k', '40k +', 'Por definir'];

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    kind: ['Web', Validators.required],
    budget: ['Por definir'],
    message: ['', [Validators.required, Validators.minLength(20)]],
    privacy: [false, Validators.requiredTrue],
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
      if (CONTACT_ENDPOINT) {
        const response = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(this.form.getRawValue()),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } else {
        // Sin endpoint configurado: se simula la latencia para poder ver los estados.
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      this.state.set('success');
      this.form.reset({ kind: 'Web', budget: 'Por definir', privacy: false });
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
