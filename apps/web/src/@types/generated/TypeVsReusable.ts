import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsReusable'
 * @name TypeVsReusableFields
 * @type {TypeVsReusableFields}
 * @memberof TypeVsReusable
 */
export interface TypeVsReusableFields {
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
 * Entry skeleton type definition for content type 'vsReusable' (VS Reusable)
 * @name TypeVsReusableSkeleton
 * @type {TypeVsReusableSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:55.204Z
 * @version 3
 */
export type TypeVsReusableSkeleton = EntrySkeletonType<TypeVsReusableFields, "vsReusable">;
/**
 * Entry type definition for content type 'vsReusable' (VS Reusable)
 * @name TypeVsReusable
 * @type {TypeVsReusable}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:55.204Z
 * @version 3
 */
export type TypeVsReusable<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsReusableSkeleton, Modifiers, Locales>;

export function isTypeVsReusable<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsReusable<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsReusable'
}

export type TypeVsReusableWithoutLinkResolutionResponse = TypeVsReusable<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsReusableWithoutUnresolvableLinksResponse = TypeVsReusable<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsReusableWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsReusable<"WITH_ALL_LOCALES", Locales>;
export type TypeVsReusableWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsReusable<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsReusableWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsReusable<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
