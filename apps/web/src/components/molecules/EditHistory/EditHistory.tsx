import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nihr-ui/frontend'

export function EditHistory() {
  return (
    <Accordion className="w-full" type="multiple">
      <AccordionItem className="border-none" value="edit-history-1">
        <AccordionTrigger>View edit history</AccordionTrigger>
        <AccordionContent>
          <Accordion type="multiple">
            <AccordionItem className="border-t" value="1">
              <AccordionTrigger
                sideContent={
                  <span>
                    <strong>Proposed change</strong> submitted by sponsorengagement@nihr.ac.uk
                  </span>
                }
              >
                Updated on 08 March 2024
              </AccordionTrigger>
              <AccordionContent indent>
                <ul aria-label="Change details" className="govuk-list govuk-list--bullet govuk-body-s">
                  <li>
                    Study status changed from &apos;Open, With Recruitment&apos; to &apos;Suspended (Open, With
                    Recruitment)&apos;
                  </li>
                  <li>Actual opening to recruitment date 06/03/2024 added</li>
                  <li>Planned opening to recruitment date 06/03/2024 removed </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger
                sideContent={
                  <span>
                    <strong>Change</strong> made by sponsorengagement@nihr.ac.uk
                  </span>
                }
              >
                Updated on 07 March 2024
              </AccordionTrigger>
              <AccordionContent indent>
                <ul aria-label="Change details" className="govuk-list govuk-list--bullet govuk-body-s">
                  <li>UK recruitment target changed from 135 to 160</li>
                  <li>Planned closure to recruitment date changed from 01/03/2024 to 02/04/2024</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
