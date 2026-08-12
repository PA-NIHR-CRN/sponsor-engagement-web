import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeValidationText'
 * @name TypeValidationTextFields
 * @type {TypeValidationTextFields}
 * @memberof TypeValidationText
 */
export interface TypeValidationTextFields {
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
 * Entry skeleton type definition for content type 'validationText' (VS Labels)
 * @name TypeValidationTextSkeleton
 * @type {TypeValidationTextSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:58.723Z
 * @version 3
 */
export type TypeValidationTextSkeleton = EntrySkeletonType<TypeValidationTextFields, "validationText">;
/**
 * Entry type definition for content type 'validationText' (VS Labels)
 * @name TypeValidationText
 * @type {TypeValidationText}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:58.723Z
 * @version 3
 */
export type TypeValidationText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeValidationTextSkeleton, Modifiers, Locales>;

export function isTypeValidationText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeValidationText<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'validationText'
}

export type TypeValidationTextWithoutLinkResolutionResponse = TypeValidationText<"WITHOUT_LINK_RESOLUTION">;
export type TypeValidationTextWithoutUnresolvableLinksResponse = TypeValidationText<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeValidationTextWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeValidationText<"WITH_ALL_LOCALES", Locales>;
export type TypeValidationTextWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeValidationText<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeValidationTextWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeValidationText<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
