import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsDocumentTitle'
 * @name TypeVsDocumentTitleFields
 * @type {TypeVsDocumentTitleFields}
 * @memberof TypeVsDocumentTitle
 */
export interface TypeVsDocumentTitleFields {
    /**
     * Field type definition for field 'key' (Key)
     * @name Key
     * @localized false
     */
    key: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'content' (Content)
     * @name Content
     * @localized true
     */
    content: EntryFieldTypes.Text;
}

/**
 * Entry skeleton type definition for content type 'vsDocumentTitle' (VS Document title)
 * @name TypeVsDocumentTitleSkeleton
 * @type {TypeVsDocumentTitleSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:56.117Z
 * @version 3
 */
export type TypeVsDocumentTitleSkeleton = EntrySkeletonType<TypeVsDocumentTitleFields, "vsDocumentTitle">;
/**
 * Entry type definition for content type 'vsDocumentTitle' (VS Document title)
 * @name TypeVsDocumentTitle
 * @type {TypeVsDocumentTitle}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:56.117Z
 * @version 3
 */
export type TypeVsDocumentTitle<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsDocumentTitleSkeleton, Modifiers, Locales>;

export function isTypeVsDocumentTitle<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsDocumentTitle<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsDocumentTitle'
}

export type TypeVsDocumentTitleWithoutLinkResolutionResponse = TypeVsDocumentTitle<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsDocumentTitleWithoutUnresolvableLinksResponse = TypeVsDocumentTitle<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsDocumentTitleWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsDocumentTitle<"WITH_ALL_LOCALES", Locales>;
export type TypeVsDocumentTitleWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsDocumentTitle<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsDocumentTitleWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsDocumentTitle<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
