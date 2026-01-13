import { defineWebComponent } from "@/core/WebComponentFactory";
import Packages from "./Package";
import type { PackagesProps } from "./Package";
import "@/styles/tokens.css"
import "./index.module.css"

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