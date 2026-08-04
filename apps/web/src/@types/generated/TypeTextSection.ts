import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeTextSection'
 * @name TypeTextSectionFields
 * @type {TypeTextSectionFields}
 * @memberof TypeTextSection
 */
export interface TypeTextSectionFields {
    /**
     * Field type definition for field 'heading' (Heading)
     * @name Heading
     * @localized true
     */
    heading: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'body' (Body)
     * @name Body
     * @localized true
     */
    body?: EntryFieldTypes.Text;
}

/**
 * Entry skeleton type definition for content type 'textSection' (Text Section)
 * @name TypeTextSectionSkeleton
 * @type {TypeTextSectionSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:44.238Z
 * @version 3
 */
export type TypeTextSectionSkeleton = EntrySkeletonType<TypeTextSectionFields, "textSection">;
/**
 * Entry type definition for content type 'textSection' (Text Section)
 * @name TypeTextSection
 * @type {TypeTextSection}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:44.238Z
 * @version 3
 */
export type TypeTextSection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTextSectionSkeleton, Modifiers, Locales>;

export function isTypeTextSection<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeTextSection<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'textSection'
}

export type TypeTextSectionWithoutLinkResolutionResponse = TypeTextSection<"WITHOUT_LINK_RESOLUTION">;
export type TypeTextSectionWithoutUnresolvableLinksResponse = TypeTextSection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeTextSectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeTextSection<"WITH_ALL_LOCALES", Locales>;
export type TypeTextSectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeTextSection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeTextSectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeTextSection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
