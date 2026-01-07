import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@monorepo/ui/components/accordion'
import { defineWebComponent } from '@/core/WebComponentFactory';
import "@/styles/widget-base.css"

interface AccordionWidgetProps {
    title: string;
    content: string;
}
function AccordionWidget({ title, content }: AccordionWidgetProps) {
  return (
    <div className='bg-primary-100'>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>
                {content}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
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