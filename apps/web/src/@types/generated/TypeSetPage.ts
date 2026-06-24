import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeGenericRichTextSkeleton } from "./TypeGenericRichText";
import type { TypeGenericRichTextLinksOnlySkeleton } from "./TypeGenericRichTextLinksOnly";
import type { TypeGenericTextSkeleton } from "./TypeGenericText";

/**
 * Fields type definition for content type 'TypeSetPage'
 * @name TypeSetPageFields
 * @type {TypeSetPageFields}
 * @memberof TypeSetPage
 */
export interface TypeSetPageFields {
    /**
     * Field type definition for field 'entryTitle' (Entry title)
     * @name Entry title
     * @localized false
     */
    entryTitle: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'notes' (Notes)
     * @name Notes
     * @localized false
     */
    notes?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'guidanceText' (Guidance text)
     * @name Guidance text
     * @localized false
     */
    guidanceText?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'pageContent' (Page Content)
     * @name Page Content
     * @localized false
     */
    pageContent?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGenericRichTextLinksOnlySkeleton | TypeGenericRichTextSkeleton | TypeGenericTextSkeleton>>;
    /**
     * Field type definition for field 'jsonTest' (Json Test)
     * @name Json Test
     * @localized false
     */
    jsonTest?: EntryFieldTypes.Object;
    /**
     * Field type definition for field 'key' (key)
     * @name key
     * @localized false
     */
    key: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'setPage' (SET page)
 * @name TypeSetPageSkeleton
 * @type {TypeSetPageSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-06-12T11:29:05.411Z
 * @version 1
 */
export type TypeSetPageSkeleton = EntrySkeletonType<TypeSetPageFields, "setPage">;
/**
 * Entry type definition for content type 'setPage' (SET page)
 * @name TypeSetPage
 * @type {TypeSetPage}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-06-12T11:29:05.411Z
 * @version 1
 */
export type TypeSetPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSetPageSkeleton, Modifiers, Locales>;

export function isTypeSetPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeSetPage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'setPage'
}

export type TypeSetPageWithoutLinkResolutionResponse = TypeSetPage<"WITHOUT_LINK_RESOLUTION">;
export type TypeSetPageWithoutUnresolvableLinksResponse = TypeSetPage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSetPageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSetPage<"WITH_ALL_LOCALES", Locales>;
export type TypeSetPageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSetPage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSetPageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSetPage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
