import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { TECH_GROUPS } from '../data/kallix.data';
import { SectionHeader } from '../ui/section-header';
import { TabItem, Tabs } from '../ui/tabs';

@Component({
  selector: 'kx-tech',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Tabs, Reveal],
  templateUrl: './tech.html',
  styleUrl: './tech.css',
})
export class Tech {
  protected readonly groups = TECH_GROUPS;
  protected readonly tabs: readonly TabItem[] = TECH_GROUPS.map(({ id, label }) => ({ id, label }));
  protected readonly selected = signal(TECH_GROUPS[0].id);

  protected readonly current = computed(
    () => this.groups.find((group) => group.id === this.selected()) ?? this.groups[0],
  );
}
