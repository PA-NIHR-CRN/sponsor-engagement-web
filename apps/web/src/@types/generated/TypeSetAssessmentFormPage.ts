import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeSetAssessmentFormPage'
 * @name TypeSetAssessmentFormPageFields
 * @type {TypeSetAssessmentFormPageFields}
 * @memberof TypeSetAssessmentFormPage
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
    /**
     * Field type definition for field 'guidanceTextOnTrack' (Guidance text, on track)
     * @name Guidance text, on track
     * @localized false
     */
    guidanceTextOnTrack: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'guidanceTextOffTrack' (Guidance text, off track)
     * @name Guidance text, off track
     * @localized false
     */
    guidanceTextOffTrack: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'setAssessmentFormPage' (SET assessment form page)
 * @name TypeSetAssessmentFormPageSkeleton
 * @type {TypeSetAssessmentFormPageSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T15:03:34.544Z
 * @version 7
 */
export type TypeSetAssessmentFormPageSkeleton = EntrySkeletonType<TypeSetAssessmentFormPageFields, "setAssessmentFormPage">;
/**
 * Entry type definition for content type 'setAssessmentFormPage' (SET assessment form page)
 * @name TypeSetAssessmentFormPage
 * @type {TypeSetAssessmentFormPage}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T15:03:34.544Z
 * @version 7
 */
export type TypeSetAssessmentFormPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSetAssessmentFormPageSkeleton, Modifiers, Locales>;

export function isTypeSetAssessmentFormPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeSetAssessmentFormPage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'setAssessmentFormPage'
}

export type TypeSetAssessmentFormPageWithoutLinkResolutionResponse = TypeSetAssessmentFormPage<"WITHOUT_LINK_RESOLUTION">;
export type TypeSetAssessmentFormPageWithoutUnresolvableLinksResponse = TypeSetAssessmentFormPage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSetAssessmentFormPageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSetAssessmentFormPage<"WITH_ALL_LOCALES", Locales>;
export type TypeSetAssessmentFormPageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSetAssessmentFormPage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSetAssessmentFormPageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSetAssessmentFormPage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
