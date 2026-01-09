import r2wc from '@r2wc/react-to-web-component'
import ComboboxComponent from './Combobox'
import "@/styles/base-theme.css"
customElements.define(
  'combobox-widget',
  r2wc(ComboboxComponent)
)