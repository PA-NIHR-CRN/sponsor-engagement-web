import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeNhsLoginButton'
 * @name TypeNhsLoginButtonFields
 * @type {TypeNhsLoginButtonFields}
 * @memberof TypeNhsLoginButton
 */
export interface TypeNhsLoginButtonFields {
    /**
     * Field type definition for field 'buttonText' (buttonText)
     * @name buttonText
     * @localized true
     */
    buttonText: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'helperText' (helperText)
     * @name helperText
     * @localized true
     */
    helperText?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'showHelperText' (Show Helper Text)
     * @name Show Helper Text
     * @localized false
     */
    showHelperText: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'nhsLoginButton' (NHS Login Button)
 * @name TypeNhsLoginButtonSkeleton
 * @type {TypeNhsLoginButtonSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:36:27.998Z
 * @version 3
 */
export type TypeNhsLoginButtonSkeleton = EntrySkeletonType<TypeNhsLoginButtonFields, "nhsLoginButton">;
/**
 * Entry type definition for content type 'nhsLoginButton' (NHS Login Button)
 * @name TypeNhsLoginButton
 * @type {TypeNhsLoginButton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:36:27.998Z
 * @version 3
 */
export type TypeNhsLoginButton<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNhsLoginButtonSkeleton, Modifiers, Locales>;

export function isTypeNhsLoginButton<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeNhsLoginButton<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'nhsLoginButton'
}

export type TypeNhsLoginButtonWithoutLinkResolutionResponse = TypeNhsLoginButton<"WITHOUT_LINK_RESOLUTION">;
export type TypeNhsLoginButtonWithoutUnresolvableLinksResponse = TypeNhsLoginButton<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNhsLoginButtonWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeNhsLoginButton<"WITH_ALL_LOCALES", Locales>;
export type TypeNhsLoginButtonWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeNhsLoginButton<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNhsLoginButtonWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeNhsLoginButton<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
