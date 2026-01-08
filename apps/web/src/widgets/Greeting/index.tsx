import Greeting, { type GreetingWidgetProps } from "./Greeting";
import { createWebComponent, registerWebComponent } from "../../core/WebComponentFactory";
import "@monorepo/ui/globals.css";

const GreetingWidget = createWebComponent<GreetingWidgetProps>({
    tagName: 'greeting-widget',
    component: Greeting,
    observedAttributes: {
        'title': 'title',
        'content': 'content',
    },
    useShadowDom: false, // Use regular DOM for easier CSS integration
});

registerWebComponent('greeting-widget', GreetingWidget);

export default GreetingWidget;