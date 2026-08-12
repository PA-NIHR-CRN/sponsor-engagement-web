import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsButtonText'
 * @name TypeVsButtonTextFields
 * @type {TypeVsButtonTextFields}
 * @memberof TypeVsButtonText
 */
export interface TypeVsButtonTextFields {
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
 * Entry skeleton type definition for content type 'vsButtonText' (VS Button Text)
 * @name TypeVsButtonTextSkeleton
 * @type {TypeVsButtonTextSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:56.876Z
 * @version 3
 */
export type TypeVsButtonTextSkeleton = EntrySkeletonType<TypeVsButtonTextFields, "vsButtonText">;
/**
 * Entry type definition for content type 'vsButtonText' (VS Button Text)
 * @name TypeVsButtonText
 * @type {TypeVsButtonText}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:56.876Z
 * @version 3
 */
export type TypeVsButtonText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsButtonTextSkeleton, Modifiers, Locales>;

export function isTypeVsButtonText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsButtonText<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsButtonText'
}

export type TypeVsButtonTextWithoutLinkResolutionResponse = TypeVsButtonText<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsButtonTextWithoutUnresolvableLinksResponse = TypeVsButtonText<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsButtonTextWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsButtonText<"WITH_ALL_LOCALES", Locales>;
export type TypeVsButtonTextWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsButtonText<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsButtonTextWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsButtonText<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
