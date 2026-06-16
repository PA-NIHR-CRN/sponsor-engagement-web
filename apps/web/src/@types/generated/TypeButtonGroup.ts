import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeButtonGroup'
 * @name TypeButtonGroupFields
 * @type {TypeButtonGroupFields}
 * @memberof TypeButtonGroup
 */
export interface TypeButtonGroupFields {
    /**
     * Field type definition for field 'buttonGroupTitle' (button-group-title)
     * @name button-group-title
     * @localized true
     */
    buttonGroupTitle?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'buttonGroupButtons' (button-group-buttons)
     * @name button-group-buttons
     * @localized true
     */
    buttonGroupButtons?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>;
}

/**
 * Entry skeleton type definition for content type 'buttonGroup' (Button Group)
 * @name TypeButtonGroupSkeleton
 * @type {TypeButtonGroupSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:42.302Z
 * @version 3
 */
export type TypeButtonGroupSkeleton = EntrySkeletonType<TypeButtonGroupFields, "buttonGroup">;
/**
 * Entry type definition for content type 'buttonGroup' (Button Group)
 * @name TypeButtonGroup
 * @type {TypeButtonGroup}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:42.302Z
 * @version 3
 */
export type TypeButtonGroup<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeButtonGroupSkeleton, Modifiers, Locales>;

export function isTypeButtonGroup<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeButtonGroup<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'buttonGroup'
}

export type TypeButtonGroupWithoutLinkResolutionResponse = TypeButtonGroup<"WITHOUT_LINK_RESOLUTION">;
export type TypeButtonGroupWithoutUnresolvableLinksResponse = TypeButtonGroup<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeButtonGroupWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeButtonGroup<"WITH_ALL_LOCALES", Locales>;
export type TypeButtonGroupWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeButtonGroup<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeButtonGroupWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeButtonGroup<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
