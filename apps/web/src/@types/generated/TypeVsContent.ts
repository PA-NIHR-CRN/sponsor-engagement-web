import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsContent'
 * @name TypeVsContentFields
 * @type {TypeVsContentFields}
 * @memberof TypeVsContent
 */
export interface TypeVsContentFields {
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
 * Entry skeleton type definition for content type 'vsContent' (VS Rich Text)
 * @name TypeVsContentSkeleton
 * @type {TypeVsContentSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:23:00.882Z
 * @version 3
 */
export type TypeVsContentSkeleton = EntrySkeletonType<TypeVsContentFields, "vsContent">;
/**
 * Entry type definition for content type 'vsContent' (VS Rich Text)
 * @name TypeVsContent
 * @type {TypeVsContent}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:23:00.882Z
 * @version 3
 */
export type TypeVsContent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsContentSkeleton, Modifiers, Locales>;

export function isTypeVsContent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsContent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsContent'
}

export type TypeVsContentWithoutLinkResolutionResponse = TypeVsContent<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsContentWithoutUnresolvableLinksResponse = TypeVsContent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsContentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsContent<"WITH_ALL_LOCALES", Locales>;
export type TypeVsContentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsContent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsContentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsContent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
