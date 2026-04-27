import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeStudyDataForm'
 * @name TypeStudyDataFormFields
 * @type {TypeStudyDataFormFields}
 * @memberof TypeStudyDataForm
 */
export interface TypeStudyDataFormFields {
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
     * Field type definition for field 'inSetupGuidanceText' (In setup guidance text)
     * @name In setup guidance text
     * @localized false
     */
    inSetupGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'openToRecruitmentGuidanceText' (Open to Recruitment Guidance text)
     * @name Open to Recruitment Guidance text
     * @localized false
     */
    openToRecruitmentGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'closedInFollowUpGuidanceText' (Closed, in follow-up guidance text)
     * @name Closed, in follow-up guidance text
     * @localized false
     */
    closedInFollowUpGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'closedGuidanceText' (Closed guidance text)
     * @name Closed guidance text
     * @localized false
     */
    closedGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'withdrawnGuidanceText' (Withdrawn guidance text)
     * @name Withdrawn guidance text
     * @localized false
     */
    withdrawnGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'suspendedGuidanceText' (Suspended Guidance text)
     * @name Suspended Guidance text
     * @localized false
     */
    suspendedGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'futherInformationLabel' (Futher information Label)
     * @name Futher information Label
     * @localized false
     */
    futherInformationLabel: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'furtherInformationGuidanceText' (Further information guidance text)
     * @name Further information guidance text
     * @localized false
     */
    furtherInformationGuidanceText: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'endMessage' (end message)
     * @name end message
     * @localized false
     */
    endMessage: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'studyDataForm' (SET Study Data Page)
 * @name TypeStudyDataFormSkeleton
 * @type {TypeStudyDataFormSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T14:41:45.901Z
 * @version 3
 */
export type TypeStudyDataFormSkeleton = EntrySkeletonType<TypeStudyDataFormFields, "studyDataForm">;
/**
 * Entry type definition for content type 'studyDataForm' (SET Study Data Page)
 * @name TypeStudyDataForm
 * @type {TypeStudyDataForm}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T14:41:45.901Z
 * @version 3
 */
export type TypeStudyDataForm<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeStudyDataFormSkeleton, Modifiers, Locales>;

export function isTypeStudyDataForm<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeStudyDataForm<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'studyDataForm'
}

export type TypeStudyDataFormWithoutLinkResolutionResponse = TypeStudyDataForm<"WITHOUT_LINK_RESOLUTION">;
export type TypeStudyDataFormWithoutUnresolvableLinksResponse = TypeStudyDataForm<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeStudyDataFormWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeStudyDataForm<"WITH_ALL_LOCALES", Locales>;
export type TypeStudyDataFormWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeStudyDataForm<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeStudyDataFormWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeStudyDataForm<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
