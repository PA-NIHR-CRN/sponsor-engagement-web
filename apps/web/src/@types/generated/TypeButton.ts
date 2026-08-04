import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeButton'
 * @name TypeButtonFields
 * @type {TypeButtonFields}
 * @memberof TypeButton
 */
export interface TypeButtonFields {
    /**
     * Field type definition for field 'buttonText' (buttonText)
     * @name buttonText
     * @localized true
     */
    buttonText: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'helperText' (Helper Text)
     * @name Helper Text
     * @localized true
     */
    helperText?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'path' (Path)
     * @name Path
     * @localized true
     */
    path?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'outlined' (Outlined)
     * @name Outlined
     * @localized false
     */
    outlined?: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'external' (External)
     * @name External
     * @localized false
     */
    external?: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'ariaLabel' (Aria Label)
     * @name Aria Label
     * @localized true
     */
    ariaLabel?: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'button' (Button)
 * @name TypeButtonSkeleton
 * @type {TypeButtonSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:36:29.372Z
 * @version 3
 */
export type TypeButtonSkeleton = EntrySkeletonType<TypeButtonFields, "button">;
/**
 * Entry type definition for content type 'button' (Button)
 * @name TypeButton
 * @type {TypeButton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:36:29.372Z
 * @version 3
 */
export type TypeButton<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeButtonSkeleton, Modifiers, Locales>;

export function isTypeButton<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeButton<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'button'
}

export type TypeButtonWithoutLinkResolutionResponse = TypeButton<"WITHOUT_LINK_RESOLUTION">;
export type TypeButtonWithoutUnresolvableLinksResponse = TypeButton<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeButtonWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeButton<"WITH_ALL_LOCALES", Locales>;
export type TypeButtonWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeButton<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeButtonWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeButton<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
