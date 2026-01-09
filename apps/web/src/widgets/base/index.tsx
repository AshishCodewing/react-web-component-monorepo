import r2wc from '@r2wc/react-to-web-component'
import BaseComponent from './Base'
import "@/styles/widget-base.css"
import "@/styles/base-theme.css"
customElements.define(
  'base-widget',
  r2wc(BaseComponent, {
    props: {
      label: 'string',
    },
  })
)