import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeRichTextSectionSkeleton } from "./TypeRichTextSection";
import type { TypeVideoSkeleton } from "./TypeVideo";

/**
 * Fields type definition for content type 'TypeArticle'
 * @name TypeArticleFields
 * @type {TypeArticleFields}
 * @memberof TypeArticle
 */
export interface TypeArticleFields {
    /**
     * Field type definition for field 'description' (Meta: Description)
     * @name Meta: Description
     * @localized true
     */
    description?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'keywords' (Meta: Keywords)
     * @name Meta: Keywords
     * @localized true
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
     * Field type definition for field 'pageUrl' (Page URL)
     * @name Page URL
     * @localized false
     */
    pageUrl: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'titleImage' (Title background image)
     * @name Title background image
     * @localized false
     */
    titleImage?: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'summary' (Summary)
     * @name Summary
     * @localized false
     */
    summary?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'searchCardImage' (search card Image)
     * @name search card Image
     * @localized false
     */
    searchCardImage: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'category' (Category)
     * @name Category
     * @localized false
     */
    category: EntryFieldTypes.Symbol<"Dementia studies" | "Join Dementia Research News" | "Opinions and blogs" | "Research news" | "Volunteer stories">;
    /**
     * Field type definition for field 'Published' (Date Published)
     * @name Date Published
     * @localized false
     */
    Published?: EntryFieldTypes.Date;
    /**
     * Field type definition for field 'pageContent' (PageContent)
     * @name PageContent
     * @localized false
     */
    pageContent: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeRichTextSectionSkeleton | TypeVideoSkeleton>>;
    /**
     * Field type definition for field 'featured' (Featured)
     * @name Featured
     * @localized false
     */
    featured?: EntryFieldTypes.Boolean;
}

/**
 * Entry skeleton type definition for content type 'article' (JDR article)
 * @name TypeArticleSkeleton
 * @type {TypeArticleSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:39.302Z
 * @version 1
 */
export type TypeArticleSkeleton = EntrySkeletonType<TypeArticleFields, "article">;
/**
 * Entry type definition for content type 'article' (JDR article)
 * @name TypeArticle
 * @type {TypeArticle}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:39.302Z
 * @version 1
 */
export type TypeArticle<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArticleSkeleton, Modifiers, Locales>;

export function isTypeArticle<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeArticle<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'article'
}

export type TypeArticleWithoutLinkResolutionResponse = TypeArticle<"WITHOUT_LINK_RESOLUTION">;
export type TypeArticleWithoutUnresolvableLinksResponse = TypeArticle<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeArticleWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeArticle<"WITH_ALL_LOCALES", Locales>;
export type TypeArticleWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeArticle<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeArticleWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeArticle<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
