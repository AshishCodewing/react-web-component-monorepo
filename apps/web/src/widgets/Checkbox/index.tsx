import { Checkbox } from "@monorepo/ui/components/checkbox"
import { Label } from "@monorepo/ui/components/label"
import { defineWebComponent } from '@/core/WebComponentFactory';
import "@monorepo/ui/globals.css"
interface CheckboxWidgetProps {
    label: string;
    description: string;
}
function CheckboxWidget({ label, description }: CheckboxWidgetProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">{label}</Label>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

export default CheckboxWidget;

defineWebComponent<CheckboxWidgetProps>({
    tagName: 'checkbox-widget',
    component: CheckboxWidget,
    observedAttributes: {
        label: 'label',
        description: 'description',
    },
});