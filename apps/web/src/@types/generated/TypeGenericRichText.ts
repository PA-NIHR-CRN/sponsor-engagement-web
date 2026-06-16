import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeGenericRichText'
 * @name TypeGenericRichTextFields
 * @type {TypeGenericRichTextFields}
 * @memberof TypeGenericRichText
 */
export interface TypeGenericRichTextFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'richText' (richText)
     * @name richText
     * @localized false
     */
    richText?: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'genericRichText' (Generic Rich Text)
 * @name TypeGenericRichTextSkeleton
 * @type {TypeGenericRichTextSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:09.394Z
 * @version 3
 */
export type TypeGenericRichTextSkeleton = EntrySkeletonType<TypeGenericRichTextFields, "genericRichText">;
/**
 * Entry type definition for content type 'genericRichText' (Generic Rich Text)
 * @name TypeGenericRichText
 * @type {TypeGenericRichText}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:09.394Z
 * @version 3
 */
export type TypeGenericRichText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGenericRichTextSkeleton, Modifiers, Locales>;

export function isTypeGenericRichText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGenericRichText<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'genericRichText'
}

export type TypeGenericRichTextWithoutLinkResolutionResponse = TypeGenericRichText<"WITHOUT_LINK_RESOLUTION">;
export type TypeGenericRichTextWithoutUnresolvableLinksResponse = TypeGenericRichText<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeGenericRichTextWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericRichText<"WITH_ALL_LOCALES", Locales>;
export type TypeGenericRichTextWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericRichText<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeGenericRichTextWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericRichText<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
