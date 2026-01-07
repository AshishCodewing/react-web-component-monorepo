import Greeting, { type GreetingWidgetProps } from "./Greeting";
import r2wc from "@r2wc/react-to-web-component";
import "@monorepo/ui/globals.css";

const GreetingWidget = r2wc<GreetingWidgetProps>(Greeting, {
    props: {
        title: 'string',
        content: 'string',
    },
});

if (!customElements.get('greeting-widget')) {
    customElements.define('greeting-widget', GreetingWidget);
}

export default GreetingWidget;