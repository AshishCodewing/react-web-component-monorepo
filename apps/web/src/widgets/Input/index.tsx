import { Input } from "@monorepo/ui/components/input"
import { defineWebComponent } from "@/core/WebComponentFactory";
import "@monorepo/ui/globals.css"
interface InputWidgetProps {
    type: string;
    placeholder: string;
}
function InputWidget({ type, placeholder }: InputWidgetProps) {
  return <Input type={type} placeholder={placeholder} />
}

export default InputWidget;

defineWebComponent<InputWidgetProps>({
    tagName: 'input-widget',
    component: InputWidget,
    observedAttributes: {
        type: 'type',
        placeholder: 'placeholder',
    },
});