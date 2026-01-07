import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@monorepo/ui/components/accordion'
import "@monorepo/ui/globals.css"

export interface GreetingWidgetProps {
    title: string;
    content: string;
}
function Greeting({ title, content }: GreetingWidgetProps) {
  return (
    <Accordion type="single" collapsible> 
        <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>
            {content}
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
}

export default Greeting;