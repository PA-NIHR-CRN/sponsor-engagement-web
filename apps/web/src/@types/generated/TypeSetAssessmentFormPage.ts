import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeSetAssesmentFormPage'
 * @name TypeSetAssessmentFormPageFields
 * @type {TypeSetAssessmentFormPageFields}
 * @memberof TypeSetAssesmentFormPage
 */
export interface TypeSetAssessmentFormPageFields {
    /**
     * Field type definition for field 'pageTitle' (Page title)
     * @name Page title
     * @localized false
     */
    pageTitle: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'pageDescription' (Page description)
     * @name Page description
     * @localized false
     */
    pageDescription: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'studyProgressionQuestionLabel' (Study progression Question label)
     * @name Study progression Question label
     * @localized false
     */
    studyProgressionQuestionLabel: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'studyProgressionOnTrackGuidanceText' (Study Progression, on track guidance text)
     * @name Study Progression, on track guidance text
     * @localized false
     */
    studyProgressionOnTrackGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'studyProgressionOffTrackGuidanceText' (Study Progression, off track guidance text)
     * @name Study Progression, off track guidance text
     * @localized false
     */
    studyProgressionOffTrackGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'additionalInfoLabel' (Additional info label)
     * @name Additional info label
     * @localized false
     */
    additionalInfoLabel: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'furtherInformationLabel' (Further information label)
     * @name Further information label
     * @localized false
     */
    furtherInformationLabel?: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'setAssesmentFormPage' (SET assesment form page)
 * @name TypeSetAssesmentFormPageSkeleton
 * @type {TypeSetAssesmentFormPageSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T15:03:34.544Z
 * @version 1
 */
export type TypeSetAssesmentFormPageSkeleton = EntrySkeletonType<TypeSetAssessmentFormPageFields, "setAssesmentFormPage">;
/**
 * Entry type definition for content type 'setAssesmentFormPage' (SET assesment form page)
 * @name TypeSetAssesmentFormPage
 * @type {TypeSetAssesmentFormPage}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T15:03:34.544Z
 * @version 1
 */
export type TypeSetAssesmentFormPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSetAssesmentFormPageSkeleton, Modifiers, Locales>;

export function isTypeSetAssesmentFormPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeSetAssesmentFormPage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'setAssesmentFormPage'
}

export type TypeSetAssesmentFormPageWithoutLinkResolutionResponse = TypeSetAssesmentFormPage<"WITHOUT_LINK_RESOLUTION">;
export type TypeSetAssesmentFormPageWithoutUnresolvableLinksResponse = TypeSetAssesmentFormPage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSetAssesmentFormPageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSetAssesmentFormPage<"WITH_ALL_LOCALES", Locales>;
export type TypeSetAssesmentFormPageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSetAssesmentFormPage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSetAssesmentFormPageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSetAssesmentFormPage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
