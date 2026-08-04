import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeBanner'
 * @name TypeBannerFields
 * @type {TypeBannerFields}
 * @memberof TypeBanner
 */
export interface TypeBannerFields {
    /**
     * Field type definition for field 'entryTitle' (Entry Title)
     * @name Entry Title
     * @localized false
     */
    entryTitle?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'bannerTitle' (Banner Title)
     * @name Banner Title
     * @localized false
     */
    bannerTitle?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'bannerBody' (Banner Body)
     * @name Banner Body
     * @localized false
     */
    bannerBody?: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'banner' (Banner)
 * @name TypeBannerSkeleton
 * @type {TypeBannerSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:07.502Z
 * @version 3
 */
export type TypeBannerSkeleton = EntrySkeletonType<TypeBannerFields, "banner">;
/**
 * Entry type definition for content type 'banner' (Banner)
 * @name TypeBanner
 * @type {TypeBanner}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:07.502Z
 * @version 3
 */
export type TypeBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBannerSkeleton, Modifiers, Locales>;

export function isTypeBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeBanner<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'banner'
}

export type TypeBannerWithoutLinkResolutionResponse = TypeBanner<"WITHOUT_LINK_RESOLUTION">;
export type TypeBannerWithoutUnresolvableLinksResponse = TypeBanner<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeBannerWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeBanner<"WITH_ALL_LOCALES", Locales>;
export type TypeBannerWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeBanner<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeBannerWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeBanner<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
