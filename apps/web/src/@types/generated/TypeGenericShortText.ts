import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeGenericShortText'
 * @name TypeGenericShortTextFields
 * @type {TypeGenericShortTextFields}
 * @memberof TypeGenericShortText
 */
export interface TypeGenericShortTextFields {
    /**
     * Field type definition for field 'entryTitle' (title)
     * @name title
     * @localized false
     */
    entryTitle?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'shortText' (shortText)
     * @name shortText
     * @localized false
     */
    shortText?: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'genericShortText' (Generic Short Text)
 * @name TypeGenericShortTextSkeleton
 * @type {TypeGenericShortTextSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:10.351Z
 * @version 3
 */
export type TypeGenericShortTextSkeleton = EntrySkeletonType<TypeGenericShortTextFields, "genericShortText">;
/**
 * Entry type definition for content type 'genericShortText' (Generic Short Text)
 * @name TypeGenericShortText
 * @type {TypeGenericShortText}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:45:10.351Z
 * @version 3
 */
export type TypeGenericShortText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGenericShortTextSkeleton, Modifiers, Locales>;

export function isTypeGenericShortText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGenericShortText<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'genericShortText'
}

export type TypeGenericShortTextWithoutLinkResolutionResponse = TypeGenericShortText<"WITHOUT_LINK_RESOLUTION">;
export type TypeGenericShortTextWithoutUnresolvableLinksResponse = TypeGenericShortText<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeGenericShortTextWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericShortText<"WITH_ALL_LOCALES", Locales>;
export type TypeGenericShortTextWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericShortText<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeGenericShortTextWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericShortText<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
