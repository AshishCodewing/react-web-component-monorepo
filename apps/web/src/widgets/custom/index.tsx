import { defineWebComponent } from "@/core/WebComponentFactory"
import CustomComponent from './Cutsom'
import styles from "@/styles/widget-base.css?inline"


defineWebComponent({
  tagName: 'custom-widget',
  component: CustomComponent,
  observedAttributes: {
    label: 'label',
  },
  styles,
  
})