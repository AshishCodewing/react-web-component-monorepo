import { defineWebComponent } from "@/core/WebComponentFactory";
import Packages from "@monorepo/ui/components/packages/Package";
import type { PackagesProps } from "@monorepo/ui/components/packages/Package";

defineWebComponent<PackagesProps>({
  tagName: 'packages-widget',
  component: Packages,
  observedAttributes: {
    packages: 'packages',
    'translated-texts': 'translatedTexts',
  },
  jsonAttributes: ['packages', 'translatedTexts'],
  events: {
    onViewDetails: 'view-details',
  },
  useShadowDom: false,
})