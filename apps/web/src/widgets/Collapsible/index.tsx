import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@monorepo/ui/components/collapsible"
  import { defineWebComponent } from '@/core/WebComponentFactory';
  import "@monorepo/ui/globals.css"
interface CollapsibleWidgetProps {
    title: string;
    content: string;
}

export default function CollapsibleWidget({ title, content }: CollapsibleWidgetProps) {
    return (
        <Collapsible>
            <CollapsibleTrigger>{title}</CollapsibleTrigger>
            <CollapsibleContent>{content}</CollapsibleContent>
        </Collapsible>
    )
}   

defineWebComponent<CollapsibleWidgetProps>({
    tagName: 'collapsible-widget',
    component: CollapsibleWidget,
    observedAttributes: {
        title: 'title',
        content: 'content',
    },
});