import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

/**
 * Fields type definition for content type 'TypeCard'
 * @name TypeCardFields
 * @type {TypeCardFields}
 * @memberof TypeCard
 */
export interface TypeCardFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'body' (Body)
     * @name Body
     * @localized true
     */
    body?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'image' (Image)
     * @name Image
     * @localized true
     */
    image?: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'link' (Link)
     * @name Link
     * @localized true
     */
    link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'card' (Card)
 * @name TypeCardSkeleton
 * @type {TypeCardSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:47.917Z
 * @version 3
 */
export type TypeCardSkeleton = EntrySkeletonType<TypeCardFields, "card">;
/**
 * Entry type definition for content type 'card' (Card)
 * @name TypeCard
 * @type {TypeCard}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:47.917Z
 * @version 3
 */
export type TypeCard<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeCardSkeleton, Modifiers, Locales>;

export function isTypeCard<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeCard<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'card'
}

export type TypeCardWithoutLinkResolutionResponse = TypeCard<"WITHOUT_LINK_RESOLUTION">;
export type TypeCardWithoutUnresolvableLinksResponse = TypeCard<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeCardWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeCard<"WITH_ALL_LOCALES", Locales>;
export type TypeCardWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeCard<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeCardWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeCard<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
