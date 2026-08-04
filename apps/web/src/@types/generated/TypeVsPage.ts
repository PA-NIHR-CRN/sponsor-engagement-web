import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsPage'
 * @name TypeVsPageFields
 * @type {TypeVsPageFields}
 * @memberof TypeVsPage
 */
export interface TypeVsPageFields {
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
 * Entry skeleton type definition for content type 'vsPage' (VS Page)
 * @name TypeVsPageSkeleton
 * @type {TypeVsPageSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:59.571Z
 * @version 3
 */
export type TypeVsPageSkeleton = EntrySkeletonType<TypeVsPageFields, "vsPage">;
/**
 * Entry type definition for content type 'vsPage' (VS Page)
 * @name TypeVsPage
 * @type {TypeVsPage}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:59.571Z
 * @version 3
 */
export type TypeVsPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsPageSkeleton, Modifiers, Locales>;

export function isTypeVsPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsPage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsPage'
}

export type TypeVsPageWithoutLinkResolutionResponse = TypeVsPage<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsPageWithoutUnresolvableLinksResponse = TypeVsPage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsPageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsPage<"WITH_ALL_LOCALES", Locales>;
export type TypeVsPageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsPage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsPageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsPage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
