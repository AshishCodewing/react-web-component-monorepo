import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@monorepo/ui/components/accordion'
import { defineWebComponent } from '@/core/WebComponentFactory';
import "@monorepo/ui/globals.css"

interface AccordionWidgetProps {
    title: string;
    content: string;
}
function AccordionWidget({ title, content }: AccordionWidgetProps) {
  return (
    <Accordion type="single" collapsible> 
        <AccordionItem value="item-1">
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>
            {content}
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
}

export default AccordionWidget;

defineWebComponent<AccordionWidgetProps>({
    tagName: 'accordion-widget',
    component: AccordionWidget,
    observedAttributes: {
        title: 'title',
        content: 'content',
    },
});