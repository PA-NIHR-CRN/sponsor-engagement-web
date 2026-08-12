import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeImageLink'
 * @name TypeImageLinkFields
 * @type {TypeImageLinkFields}
 * @memberof TypeImageLink
 */
export interface TypeImageLinkFields {
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
    /**
     * Field type definition for field 'image' (Image)
     * @name Image
     * @localized false
     */
    image: EntryFieldTypes.AssetLink;
}

/**
 * Entry skeleton type definition for content type 'imageLink' (Image Link)
 * @name TypeImageLinkSkeleton
 * @type {TypeImageLinkSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:38.868Z
 * @version 1
 */
export type TypeImageLinkSkeleton = EntrySkeletonType<TypeImageLinkFields, "imageLink">;
/**
 * Entry type definition for content type 'imageLink' (Image Link)
 * @name TypeImageLink
 * @type {TypeImageLink}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:38.868Z
 * @version 1
 */
export type TypeImageLink<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeImageLinkSkeleton, Modifiers, Locales>;

export function isTypeImageLink<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeImageLink<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'imageLink'
}

export type TypeImageLinkWithoutLinkResolutionResponse = TypeImageLink<"WITHOUT_LINK_RESOLUTION">;
export type TypeImageLinkWithoutUnresolvableLinksResponse = TypeImageLink<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeImageLinkWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeImageLink<"WITH_ALL_LOCALES", Locales>;
export type TypeImageLinkWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeImageLink<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeImageLinkWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeImageLink<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
