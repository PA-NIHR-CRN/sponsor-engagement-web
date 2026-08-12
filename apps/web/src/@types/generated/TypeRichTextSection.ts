import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeRichTextSection'
 * @name TypeRichTextSectionFields
 * @type {TypeRichTextSectionFields}
 * @memberof TypeRichTextSection
 */
export interface TypeRichTextSectionFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'Text' (text)
     * @name text
     * @localized false
     */
    Text: EntryFieldTypes.RichText;
}

/**
 * Entry skeleton type definition for content type 'richTextSection' (Rich text Section)
 * @name TypeRichTextSectionSkeleton
 * @type {TypeRichTextSectionSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:38.428Z
 * @version 1
 */
export type TypeRichTextSectionSkeleton = EntrySkeletonType<TypeRichTextSectionFields, "richTextSection">;
/**
 * Entry type definition for content type 'richTextSection' (Rich text Section)
 * @name TypeRichTextSection
 * @type {TypeRichTextSection}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:38.428Z
 * @version 1
 */
export type TypeRichTextSection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRichTextSectionSkeleton, Modifiers, Locales>;

export function isTypeRichTextSection<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeRichTextSection<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'richTextSection'
}

export type TypeRichTextSectionWithoutLinkResolutionResponse = TypeRichTextSection<"WITHOUT_LINK_RESOLUTION">;
export type TypeRichTextSectionWithoutUnresolvableLinksResponse = TypeRichTextSection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeRichTextSectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeRichTextSection<"WITH_ALL_LOCALES", Locales>;
export type TypeRichTextSectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeRichTextSection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeRichTextSectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeRichTextSection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
