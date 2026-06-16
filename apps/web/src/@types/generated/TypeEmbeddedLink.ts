import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeEmbeddedLink'
 * @name TypeEmbeddedLinkFields
 * @type {TypeEmbeddedLinkFields}
 * @memberof TypeEmbeddedLink
 */
export interface TypeEmbeddedLinkFields {
    /**
     * Field type definition for field 'external' (External)
     * @name External
     * @localized false
     */
    external: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'uri' (Uri)
     * @name Uri
     * @localized true
     */
    uri: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'renderStyle' (RenderStyle)
     * @name RenderStyle
     * @localized false
     */
    renderStyle?: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'embeddedLink' (Embedded Link)
 * @name TypeEmbeddedLinkSkeleton
 * @type {TypeEmbeddedLinkSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:36:27.168Z
 * @version 3
 */
export type TypeEmbeddedLinkSkeleton = EntrySkeletonType<TypeEmbeddedLinkFields, "embeddedLink">;
/**
 * Entry type definition for content type 'embeddedLink' (Embedded Link)
 * @name TypeEmbeddedLink
 * @type {TypeEmbeddedLink}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:36:27.168Z
 * @version 3
 */
export type TypeEmbeddedLink<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeEmbeddedLinkSkeleton, Modifiers, Locales>;

export function isTypeEmbeddedLink<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeEmbeddedLink<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'embeddedLink'
}

export type TypeEmbeddedLinkWithoutLinkResolutionResponse = TypeEmbeddedLink<"WITHOUT_LINK_RESOLUTION">;
export type TypeEmbeddedLinkWithoutUnresolvableLinksResponse = TypeEmbeddedLink<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeEmbeddedLinkWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeEmbeddedLink<"WITH_ALL_LOCALES", Locales>;
export type TypeEmbeddedLinkWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeEmbeddedLink<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeEmbeddedLinkWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeEmbeddedLink<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
