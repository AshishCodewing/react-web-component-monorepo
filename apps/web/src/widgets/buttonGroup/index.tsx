// import r2wc from '@r2wc/react-to-web-component'
// import { ButtonGroupDemo } from './ButtonGroup'
// import "@/styles/widget-base.css"
// customElements.define(
//   'button-group-widget',
//   r2wc(ButtonGroupDemo)
// )

import { defineWebComponent } from "@/core/WebComponentFactory"
import { ButtonGroupDemo } from './ButtonGroup'
import styles from "@/styles/widget-base.css?inline"


defineWebComponent({
  tagName: 'button-group-widget',
  component: ButtonGroupDemo,
  observedAttributes: {},
  styles,
})