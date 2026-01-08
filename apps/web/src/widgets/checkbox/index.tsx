import r2wc from '@r2wc/react-to-web-component'
import CheckboxComponent from './Checkbox'
import "@/styles/widget-base.css"

customElements.define(
  'checkbox-widget',
  r2wc(CheckboxComponent, {
    props: {
      label: 'string',
    },
  })
)