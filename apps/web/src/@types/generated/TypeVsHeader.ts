import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsHeader'
 * @name TypeVsHeaderFields
 * @type {TypeVsHeaderFields}
 * @memberof TypeVsHeader
 */
export interface TypeVsHeaderFields {
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
 * Entry skeleton type definition for content type 'vsHeader' (VS Header)
 * @name TypeVsHeaderSkeleton
 * @type {TypeVsHeaderSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:57.698Z
 * @version 3
 */
export type TypeVsHeaderSkeleton = EntrySkeletonType<TypeVsHeaderFields, "vsHeader">;
/**
 * Entry type definition for content type 'vsHeader' (VS Header)
 * @name TypeVsHeader
 * @type {TypeVsHeader}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:57.698Z
 * @version 3
 */
export type TypeVsHeader<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsHeaderSkeleton, Modifiers, Locales>;

export function isTypeVsHeader<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsHeader<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsHeader'
}

export type TypeVsHeaderWithoutLinkResolutionResponse = TypeVsHeader<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsHeaderWithoutUnresolvableLinksResponse = TypeVsHeader<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsHeaderWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsHeader<"WITH_ALL_LOCALES", Locales>;
export type TypeVsHeaderWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsHeader<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsHeaderWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsHeader<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
