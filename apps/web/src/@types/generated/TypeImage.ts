import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeImage'
 * @name TypeImageFields
 * @type {TypeImageFields}
 * @memberof TypeImage
 */
export interface TypeImageFields {
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized true
     */
    description?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'image' (Image)
     * @name Image
     * @localized false
     */
    image: EntryFieldTypes.AssetLink;
}

/**
 * Entry skeleton type definition for content type 'image' (Image)
 * @name TypeImageSkeleton
 * @type {TypeImageSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:49.652Z
 * @version 3
 */
export type TypeImageSkeleton = EntrySkeletonType<TypeImageFields, "image">;
/**
 * Entry type definition for content type 'image' (Image)
 * @name TypeImage
 * @type {TypeImage}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:49.652Z
 * @version 3
 */
export type TypeImage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeImageSkeleton, Modifiers, Locales>;

export function isTypeImage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeImage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'image'
}

export type TypeImageWithoutLinkResolutionResponse = TypeImage<"WITHOUT_LINK_RESOLUTION">;
export type TypeImageWithoutUnresolvableLinksResponse = TypeImage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeImageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeImage<"WITH_ALL_LOCALES", Locales>;
export type TypeImageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeImage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeImageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeImage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
