import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeSetLabel'
 * @name TypeSetLabelFields
 * @type {TypeSetLabelFields}
 * @memberof TypeSetLabel
 */
export interface TypeSetLabelFields {
    /**
     * Field type definition for field 'key' (Key)
     * @name Key
     * @localized false
     */
    key: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'content' (content)
     * @name content
     * @localized false
     */
    content: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'setLabel' (SET organisation details)
 * @name TypeSetLabelSkeleton
 * @type {TypeSetLabelSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-22T09:40:45.442Z
 * @version 3
 */
export type TypeSetLabelSkeleton = EntrySkeletonType<TypeSetLabelFields, "setLabel">;
/**
 * Entry type definition for content type 'setLabel' (SET organisation details)
 * @name TypeSetLabel
 * @type {TypeSetLabel}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-04-22T09:40:45.442Z
 * @version 3
 */
export type TypeSetLabel<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSetLabelSkeleton, Modifiers, Locales>;

export function isTypeSetLabel<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeSetLabel<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'setLabel'
}

export type TypeSetLabelWithoutLinkResolutionResponse = TypeSetLabel<"WITHOUT_LINK_RESOLUTION">;
export type TypeSetLabelWithoutUnresolvableLinksResponse = TypeSetLabel<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSetLabelWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSetLabel<"WITH_ALL_LOCALES", Locales>;
export type TypeSetLabelWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSetLabel<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSetLabelWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSetLabel<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
