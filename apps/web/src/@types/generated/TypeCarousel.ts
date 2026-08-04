import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeCardSkeleton } from "./TypeCard";

/**
 * Fields type definition for content type 'TypeCarousel'
 * @name TypeCarouselFields
 * @type {TypeCarouselFields}
 * @memberof TypeCarousel
 */
export interface TypeCarouselFields {
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
     * Field type definition for field 'cards' (Cards)
     * @name Cards
     * @localized true
     */
    cards: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCardSkeleton>>;
}

/**
 * Entry skeleton type definition for content type 'carousel' (Carousel)
 * @name TypeCarouselSkeleton
 * @type {TypeCarouselSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:47.153Z
 * @version 3
 */
export type TypeCarouselSkeleton = EntrySkeletonType<TypeCarouselFields, "carousel">;
/**
 * Entry type definition for content type 'carousel' (Carousel)
 * @name TypeCarousel
 * @type {TypeCarousel}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:47.153Z
 * @version 3
 */
export type TypeCarousel<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeCarouselSkeleton, Modifiers, Locales>;

export function isTypeCarousel<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeCarousel<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'carousel'
}

export type TypeCarouselWithoutLinkResolutionResponse = TypeCarousel<"WITHOUT_LINK_RESOLUTION">;
export type TypeCarouselWithoutUnresolvableLinksResponse = TypeCarousel<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeCarouselWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeCarousel<"WITH_ALL_LOCALES", Locales>;
export type TypeCarouselWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeCarousel<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeCarouselWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeCarousel<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
