import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeEmailTemplate'
 * @name TypeEmailTemplateFields
 * @type {TypeEmailTemplateFields}
 * @memberof TypeEmailTemplate
 */
export interface TypeEmailTemplateFields {
    /**
     * Field type definition for field 'key' (key)
     * @name key
     * @localized false
     */
    key: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'emailSubject' (Email Subject)
     * @name Email Subject
     * @localized true
     */
    emailSubject: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'emailBody' (Email Body)
     * @name Email Body
     * @localized true
     */
    emailBody: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'emailTemplate' (Email Template)
 * @name TypeEmailTemplateSkeleton
 * @type {TypeEmailTemplateSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:52.822Z
 * @version 3
 */
export type TypeEmailTemplateSkeleton = EntrySkeletonType<TypeEmailTemplateFields, "emailTemplate">;
/**
 * Entry type definition for content type 'emailTemplate' (Email Template)
 * @name TypeEmailTemplate
 * @type {TypeEmailTemplate}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:52.822Z
 * @version 3
 */
export type TypeEmailTemplate<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeEmailTemplateSkeleton, Modifiers, Locales>;

export function isTypeEmailTemplate<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeEmailTemplate<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'emailTemplate'
}

export type TypeEmailTemplateWithoutLinkResolutionResponse = TypeEmailTemplate<"WITHOUT_LINK_RESOLUTION">;
export type TypeEmailTemplateWithoutUnresolvableLinksResponse = TypeEmailTemplate<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeEmailTemplateWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeEmailTemplate<"WITH_ALL_LOCALES", Locales>;
export type TypeEmailTemplateWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeEmailTemplate<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeEmailTemplateWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeEmailTemplate<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
