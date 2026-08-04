import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsValidation'
 * @name TypeVsValidationFields
 * @type {TypeVsValidationFields}
 * @memberof TypeVsValidation
 */
export interface TypeVsValidationFields {
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
 * Entry skeleton type definition for content type 'vsValidation' (VS Validation)
 * @name TypeVsValidationSkeleton
 * @type {TypeVsValidationSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:53.781Z
 * @version 3
 */
export type TypeVsValidationSkeleton = EntrySkeletonType<TypeVsValidationFields, "vsValidation">;
/**
 * Entry type definition for content type 'vsValidation' (VS Validation)
 * @name TypeVsValidation
 * @type {TypeVsValidation}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:53.781Z
 * @version 3
 */
export type TypeVsValidation<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsValidationSkeleton, Modifiers, Locales>;

export function isTypeVsValidation<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsValidation<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsValidation'
}

export type TypeVsValidationWithoutLinkResolutionResponse = TypeVsValidation<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsValidationWithoutUnresolvableLinksResponse = TypeVsValidation<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsValidationWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsValidation<"WITH_ALL_LOCALES", Locales>;
export type TypeVsValidationWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsValidation<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsValidationWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsValidation<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
