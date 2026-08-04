import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeListItem'
 * @name TypeListItemFields
 * @type {TypeListItemFields}
 * @memberof TypeListItem
 */
export interface TypeListItemFields {
    /**
     * Field type definition for field 'heading' (Heading)
     * @name Heading
     * @localized true
     */
    heading?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'body' (Body)
     * @name Body
     * @localized true
     */
    body?: EntryFieldTypes.Text;
}

/**
 * Entry skeleton type definition for content type 'listItem' (List Item)
 * @name TypeListItemSkeleton
 * @type {TypeListItemSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:45.975Z
 * @version 3
 */
export type TypeListItemSkeleton = EntrySkeletonType<TypeListItemFields, "listItem">;
/**
 * Entry type definition for content type 'listItem' (List Item)
 * @name TypeListItem
 * @type {TypeListItem}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:45.975Z
 * @version 3
 */
export type TypeListItem<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeListItemSkeleton, Modifiers, Locales>;

export function isTypeListItem<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeListItem<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'listItem'
}

export type TypeListItemWithoutLinkResolutionResponse = TypeListItem<"WITHOUT_LINK_RESOLUTION">;
export type TypeListItemWithoutUnresolvableLinksResponse = TypeListItem<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeListItemWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeListItem<"WITH_ALL_LOCALES", Locales>;
export type TypeListItemWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeListItem<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeListItemWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeListItem<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
