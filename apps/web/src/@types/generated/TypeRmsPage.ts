import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeRmsPage'
 * @name TypeRmsPageFields
 * @type {TypeRmsPageFields}
 * @memberof TypeRmsPage
 */
export interface TypeRmsPageFields {
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
    content: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'rmsPage' (Rms Page)
 * @name TypeRmsPageSkeleton
 * @type {TypeRmsPageSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:51.778Z
 * @version 3
 */
export type TypeRmsPageSkeleton = EntrySkeletonType<TypeRmsPageFields, "rmsPage">;
/**
 * Entry type definition for content type 'rmsPage' (Rms Page)
 * @name TypeRmsPage
 * @type {TypeRmsPage}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:51.778Z
 * @version 3
 */
export type TypeRmsPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRmsPageSkeleton, Modifiers, Locales>;

export function isTypeRmsPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeRmsPage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'rmsPage'
}

export type TypeRmsPageWithoutLinkResolutionResponse = TypeRmsPage<"WITHOUT_LINK_RESOLUTION">;
export type TypeRmsPageWithoutUnresolvableLinksResponse = TypeRmsPage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeRmsPageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeRmsPage<"WITH_ALL_LOCALES", Locales>;
export type TypeRmsPageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeRmsPage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeRmsPageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeRmsPage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
