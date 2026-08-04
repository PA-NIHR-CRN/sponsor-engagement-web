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
     * Field type definition for field 'furtherInformationLabel' (Further information Label)
     * @name Further information Label
     * @localized false
     */
    furtherInformationLabel: EntryFieldTypes.Symbol;
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
    /**
     * Field type definition for field 'guidanceTextInSetup' (Guidance text, In setup)
     * @name Guidance text, In setup
     * @localized false
     */
    guidanceTextInSetup: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'guidanceTextOpenToRecruitment' (Guidance text, Open to recruitment)
     * @name Guidance text, Open to recruitment
     * @localized false
     */
    guidanceTextOpenToRecruitment: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'guidanceTextClosedInFollowUp' (Guidance text, Closed, in follow-up)
     * @name Guidance text, Closed, in follow-up
     * @localized false
     */
    guidanceTextClosedInFollowUp: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'guidanceTextClosed' (Guidance text, Closed)
     * @name Guidance text, Closed
     * @localized false
     */
    guidanceTextClosed: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'guidanceTextWithdrawn' (Guidance text, Withdrawn)
     * @name Guidance text, Withdrawn
     * @localized false
     */
    guidanceTextWithdrawn: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'guidanceTextSuspended' (Guidance text, Suspended)
     * @name Guidance text, Suspended
     * @localized false
     */
    guidanceTextSuspended: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'studyDataForm' (SET Study Data Page)
 * @name TypeStudyDataFormSkeleton
 * @type {TypeStudyDataFormSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T14:41:45.901Z
 * @version 7
 */
export type TypeStudyDataFormSkeleton = EntrySkeletonType<TypeStudyDataFormFields, "studyDataForm">;
/**
 * Entry type definition for content type 'studyDataForm' (SET Study Data Page)
 * @name TypeStudyDataForm
 * @type {TypeStudyDataForm}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-23T14:41:45.901Z
 * @version 7
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
