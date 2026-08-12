import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

/**
 * Fields type definition for content type 'TypeOnlineResourcesSection'
 * @name TypeOnlineResourcesSectionFields
 * @type {TypeOnlineResourcesSectionFields}
 * @memberof TypeOnlineResourcesSection
 */
export interface TypeOnlineResourcesSectionFields {
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
    text: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'image' (image)
     * @name image
     * @localized false
     */
    image: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'link' (link)
     * @name link
     * @localized false
     */
    link: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'onlineResourcesSection' (Online Resources section)
 * @name TypeOnlineResourcesSectionSkeleton
 * @type {TypeOnlineResourcesSectionSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:36.515Z
 * @version 1
 */
export type TypeOnlineResourcesSectionSkeleton = EntrySkeletonType<TypeOnlineResourcesSectionFields, "onlineResourcesSection">;
/**
 * Entry type definition for content type 'onlineResourcesSection' (Online Resources section)
 * @name TypeOnlineResourcesSection
 * @type {TypeOnlineResourcesSection}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:36.515Z
 * @version 1
 */
export type TypeOnlineResourcesSection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeOnlineResourcesSectionSkeleton, Modifiers, Locales>;

export function isTypeOnlineResourcesSection<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeOnlineResourcesSection<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'onlineResourcesSection'
}

export type TypeOnlineResourcesSectionWithoutLinkResolutionResponse = TypeOnlineResourcesSection<"WITHOUT_LINK_RESOLUTION">;
export type TypeOnlineResourcesSectionWithoutUnresolvableLinksResponse = TypeOnlineResourcesSection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeOnlineResourcesSectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeOnlineResourcesSection<"WITH_ALL_LOCALES", Locales>;
export type TypeOnlineResourcesSectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeOnlineResourcesSection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeOnlineResourcesSectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeOnlineResourcesSection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
