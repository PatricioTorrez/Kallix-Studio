import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { Tilt } from '../core/tilt.directive';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/kallix.data';
import { Badge } from '../ui/badge';
import { Icon } from '../ui/icon';
import { ProjectPreview } from '../ui/project-preview';
import { SectionHeader } from '../ui/section-header';
import { TabItem, Tabs } from '../ui/tabs';

@Component({
  selector: 'kx-portfolio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Tabs, ProjectPreview, Badge, Icon, Reveal, Tilt],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {
  protected readonly filters: readonly TabItem[] = PROJECT_CATEGORIES.map((category) => ({
    id: category,
    label: category,
  }));

  protected readonly filter = signal<string>('Todo');

  protected readonly visible = computed(() =>
    this.filter() === 'Todo'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === this.filter()),
  );
}
