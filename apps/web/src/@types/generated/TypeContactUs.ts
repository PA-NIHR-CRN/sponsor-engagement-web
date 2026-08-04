import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

/**
 * Fields type definition for content type 'TypeContactUs'
 * @name TypeContactUsFields
 * @type {TypeContactUsFields}
 * @memberof TypeContactUs
 */
export interface TypeContactUsFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'text' (text)
     * @name text
     * @localized false
     */
    text?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'link' (link)
     * @name link
     * @localized false
     */
    link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'contactUs' (Contact Us)
 * @name TypeContactUsSkeleton
 * @type {TypeContactUsSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:36.949Z
 * @version 1
 */
export type TypeContactUsSkeleton = EntrySkeletonType<TypeContactUsFields, "contactUs">;
/**
 * Entry type definition for content type 'contactUs' (Contact Us)
 * @name TypeContactUs
 * @type {TypeContactUs}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:36.949Z
 * @version 1
 */
export type TypeContactUs<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeContactUsSkeleton, Modifiers, Locales>;

export function isTypeContactUs<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeContactUs<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'contactUs'
}

export type TypeContactUsWithoutLinkResolutionResponse = TypeContactUs<"WITHOUT_LINK_RESOLUTION">;
export type TypeContactUsWithoutUnresolvableLinksResponse = TypeContactUs<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContactUsWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeContactUs<"WITH_ALL_LOCALES", Locales>;
export type TypeContactUsWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeContactUs<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeContactUsWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeContactUs<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
