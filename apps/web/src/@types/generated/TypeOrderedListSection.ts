import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeListItemSkeleton } from "./TypeListItem";

/**
 * Fields type definition for content type 'TypeOrderedListSection'
 * @name TypeOrderedListSectionFields
 * @type {TypeOrderedListSectionFields}
 * @memberof TypeOrderedListSection
 */
export interface TypeOrderedListSectionFields {
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
     * Field type definition for field 'items' (Items)
     * @name Items
     * @localized true
     */
    items?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeListItemSkeleton>>;
}

/**
 * Entry skeleton type definition for content type 'orderedListSection' (Ordered List Section)
 * @name TypeOrderedListSectionSkeleton
 * @type {TypeOrderedListSectionSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:45.143Z
 * @version 3
 */
export type TypeOrderedListSectionSkeleton = EntrySkeletonType<TypeOrderedListSectionFields, "orderedListSection">;
/**
 * Entry type definition for content type 'orderedListSection' (Ordered List Section)
 * @name TypeOrderedListSection
 * @type {TypeOrderedListSection}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:45.143Z
 * @version 3
 */
export type TypeOrderedListSection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeOrderedListSectionSkeleton, Modifiers, Locales>;

export function isTypeOrderedListSection<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeOrderedListSection<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'orderedListSection'
}

export type TypeOrderedListSectionWithoutLinkResolutionResponse = TypeOrderedListSection<"WITHOUT_LINK_RESOLUTION">;
export type TypeOrderedListSectionWithoutUnresolvableLinksResponse = TypeOrderedListSection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeOrderedListSectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeOrderedListSection<"WITH_ALL_LOCALES", Locales>;
export type TypeOrderedListSectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeOrderedListSection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeOrderedListSectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeOrderedListSection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
