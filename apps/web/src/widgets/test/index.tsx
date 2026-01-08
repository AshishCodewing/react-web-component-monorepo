import r2wc from '@r2wc/react-to-web-component'
import Test from './Test'
import "@/styles/widget-base.css"

customElements.define(
  'test-widget',
  r2wc(Test, {
    props: {
      label: 'string'
    }
  })
)