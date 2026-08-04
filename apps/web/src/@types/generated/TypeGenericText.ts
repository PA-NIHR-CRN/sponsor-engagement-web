import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeGenericText'
 * @name TypeGenericTextFields
 * @type {TypeGenericTextFields}
 * @memberof TypeGenericText
 */
export interface TypeGenericTextFields {
    /**
     * Field type definition for field 'contentTitle' (Content Title)
     * @name Content Title
     * @localized false
     */
    contentTitle: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'text' (Text)
     * @name Text
     * @localized false
     */
    text: EntryFieldTypes.Text;
}

/**
 * Entry skeleton type definition for content type 'genericText' (Generic Text)
 * @name TypeGenericTextSkeleton
 * @type {TypeGenericTextSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:37.391Z
 * @version 1
 */
export type TypeGenericTextSkeleton = EntrySkeletonType<TypeGenericTextFields, "genericText">;
/**
 * Entry type definition for content type 'genericText' (Generic Text)
 * @name TypeGenericText
 * @type {TypeGenericText}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:37.391Z
 * @version 1
 */
export type TypeGenericText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGenericTextSkeleton, Modifiers, Locales>;

export function isTypeGenericText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGenericText<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'genericText'
}

export type TypeGenericTextWithoutLinkResolutionResponse = TypeGenericText<"WITHOUT_LINK_RESOLUTION">;
export type TypeGenericTextWithoutUnresolvableLinksResponse = TypeGenericText<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeGenericTextWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericText<"WITH_ALL_LOCALES", Locales>;
export type TypeGenericTextWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericText<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeGenericTextWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericText<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
