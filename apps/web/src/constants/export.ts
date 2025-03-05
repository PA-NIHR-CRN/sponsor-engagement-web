/**
 * File name for the downloaded export
 */
export const FILE_NAME = 'studies.xlsx'

/**
 * Helper/intro text for the excel document
 */
export const HELPER_TEXT = `This download is a snapshot of all the information held within the Sponsor Engagement Tool for the sponsor/delegate organisation. Once exported, the information within this document may become out of date and is no longer guaranteed to be an accurate copy of data held by the live Sponsor Engagement Tool. 

This export was created on %s.

Please note that the security of the information contained in this document is the responsibility of the sponsor who requested the export as per the tool's Terms and Conditions (https://sites.google.com/nihr.ac.uk/crncc-policies/set/terms-and-conditions) and Privacy Notice (https://sites.google.com/nihr.ac.uk/crncc-policies/set/privacy-notice).

Data in this document cannot be imported back into the Sponsor Engagement Tool. 

The last columns in the spreadsheet are provided only to assist with local data gathering for new study assessments. For example; if there is an update to a study status, planned or actual milestone dates or targets, information can be added to the ‘additional information’ column. Once collated, information then has to be entered into the live Sponsor Engagement Tool (https://assessmystudy.nihr.ac.uk) by the sponsor / delegate representative. 

If any further information, advice or support is required, please contact supportmystudy@nihr.ac.uk`

/** Pink colour for editable column headings */
export const PINK_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F6D7D2' } } as const

/** Red text colour */
export const RED_TEXT = { font: { color: { argb: 'B40000' } } } as const

export const Column = {
  SponsorAssessment: 'U',
  AdditionalInformation: 'V',
}
