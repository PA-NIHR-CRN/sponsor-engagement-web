import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeLink'
 * @name TypeLinkFields
 * @type {TypeLinkFields}
 * @memberof TypeLink
 */
export interface TypeLinkFields {
    /**
     * Field type definition for field 'label' (Label)
     * @name Label
     * @localized true
     */
    label: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'url' (URL)
     * @name URL
     * @localized true
     */
    url: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'ariaLabel' (ARIA Label)
     * @name ARIA Label
     * @localized true
     */
    ariaLabel?: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'link' (Link)
 * @name TypeLinkSkeleton
 * @type {TypeLinkSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:48.868Z
 * @version 3
 */
export type TypeLinkSkeleton = EntrySkeletonType<TypeLinkFields, "link">;
/**
 * Entry type definition for content type 'link' (Link)
 * @name TypeLink
 * @type {TypeLink}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:48.868Z
 * @version 3
 */
export type TypeLink<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLinkSkeleton, Modifiers, Locales>;

export function isTypeLink<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeLink<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'link'
}

export type TypeLinkWithoutLinkResolutionResponse = TypeLink<"WITHOUT_LINK_RESOLUTION">;
export type TypeLinkWithoutUnresolvableLinksResponse = TypeLink<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeLinkWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeLink<"WITH_ALL_LOCALES", Locales>;
export type TypeLinkWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeLink<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeLinkWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeLink<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
