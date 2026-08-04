import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeGenericTextSkeleton } from "./TypeGenericText";
import type { TypeRichTextSectionSkeleton } from "./TypeRichTextSection";

/**
 * Fields type definition for content type 'TypeGenericPage'
 * @name TypeGenericPageFields
 * @type {TypeGenericPageFields}
 * @memberof TypeGenericPage
 */
export interface TypeGenericPageFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'pageUrl' (Page URL)
     * @name Page URL
     * @localized false
     */
    pageUrl: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'description' (Meta: Description)
     * @name Meta: Description
     * @localized false
     */
    description?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'keywords' (Meta: Keywords)
     * @name Meta: Keywords
     * @localized false
     */
    keywords?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'metaImage' (Meta: Image)
     * @name Meta: Image
     * @localized false
     */
    metaImage?: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'metaImageAlt' (Meta: Image Alt)
     * @name Meta: Image Alt
     * @localized false
     */
    metaImageAlt?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'pageSections' (Page sections)
     * @name Page sections
     * @localized false
     */
    pageSections: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGenericTextSkeleton | TypeRichTextSectionSkeleton >>;
}

/**
 * Entry skeleton type definition for content type 'genericPage' (Generic Page)
 * @name TypeGenericPageSkeleton
 * @type {TypeGenericPageSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:37.776Z
 * @version 1
 */
export type TypeGenericPageSkeleton = EntrySkeletonType<TypeGenericPageFields, "genericPage">;
/**
 * Entry type definition for content type 'genericPage' (Generic Page)
 * @name TypeGenericPage
 * @type {TypeGenericPage}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:37.776Z
 * @version 1
 */
export type TypeGenericPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGenericPageSkeleton, Modifiers, Locales>;

export function isTypeGenericPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGenericPage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'genericPage'
}

export type TypeGenericPageWithoutLinkResolutionResponse = TypeGenericPage<"WITHOUT_LINK_RESOLUTION">;
export type TypeGenericPageWithoutUnresolvableLinksResponse = TypeGenericPage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeGenericPageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericPage<"WITH_ALL_LOCALES", Locales>;
export type TypeGenericPageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericPage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeGenericPageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeGenericPage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
