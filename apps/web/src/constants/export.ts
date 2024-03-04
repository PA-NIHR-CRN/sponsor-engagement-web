/**
 * File name for the downloaded export
 */
export const FILE_NAME = 'studies.xlsx'

/**
 * Helper/intro text for the excel document
 */
export const HELPER_TEXT = `This export provides a static download of the information held within the Sponsor Engagement Tools for the sponsor / delegate organisation.

Please note that the information within this export download may become out of date and become misaligned with the live Sponsor Engagement Tool and once exported, the security of the information is the responsibility of the sponsor who requested the export.

Please use columns X to provide an Assessment for each study. Please use column X to provide further information, as needed. For example; if there is an update to a study status, planned or actual milestone dates or targets, please add this information to the ‘additional information’ column.

There is no ability to automatically import the information collected via this export into the Sponsor Engagement Tool. Therefore, please can the sponsor / delegate representative enter the information into the live Sponsor Engagement Tool (https://assessmystudy.nihr.ac.uk/).

If any further information, advice or support is required, please contact supportmystudy@nihr.ac.uk`

/** Pink colour for editable column headings */
export const PINK_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F6D7D2' } } as const

/** Grey colour for empty cells */
export const GREY_FILL = { type: 'pattern', pattern: 'solid', bgColor: { argb: 'F0F0F0' } } as const
