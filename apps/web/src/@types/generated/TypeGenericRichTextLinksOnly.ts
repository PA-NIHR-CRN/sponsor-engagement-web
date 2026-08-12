import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeGenericRichTextLinksOnly'
 * @name TypeGenericRichTextLinksOnlyFields
 * @type {TypeGenericRichTextLinksOnlyFields}
 * @memberof TypeGenericRichTextLinksOnly
 */
export interface TypeGenericRichTextLinksOnlyFields {
    /**
     * Field type definition for field 'title' (title)
     * @name title
     * @localized false
     */
    title?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'richTextLinksOnly' (richTextLinksOnly)
     * @name richTextLinksOnly
     * @localized false
     */
    richTextLinksOnly?: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'genericRichTextLinksOnly' (Generic Rich Text (Links only))
 * @name TypeGenericRichTextLinksOnlySkeleton
 * @type {TypeGenericRichTextLinksOnlySkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:08.414Z
 * @version 3
 */
export type TypeGenericRichTextLinksOnlySkeleton = EntrySkeletonType<TypeGenericRichTextLinksOnlyFields, "genericRichTextLinksOnly">;
/**
 * Entry type definition for content type 'genericRichTextLinksOnly' (Generic Rich Text (Links only))
 * @name TypeGenericRichTextLinksOnly
 * @type {TypeGenericRichTextLinksOnly}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:08.414Z
 * @version 3
 */
export type TypeGenericRichTextLinksOnly<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGenericRichTextLinksOnlySkeleton, Modifiers, Locales>;

export function isTypeGenericRichTextLinksOnly<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGenericRichTextLinksOnly<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'genericRichTextLinksOnly'
}

export type TypeGenericRichTextLinksOnlyWithoutLinkResolutionResponse = TypeGenericRichTextLinksOnly<"WITHOUT_LINK_RESOLUTION">;
export type TypeGenericRichTextLinksOnlyWithoutUnresolvableLinksResponse = TypeGenericRichTextLinksOnly<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeGenericRichTextLinksOnlyWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericRichTextLinksOnly<"WITH_ALL_LOCALES", Locales>;
export type TypeGenericRichTextLinksOnlyWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericRichTextLinksOnly<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeGenericRichTextLinksOnlyWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericRichTextLinksOnly<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
