import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionSectionSkeleton } from "./TypeAccordionSection";
import type { TypeCardSkeleton } from "./TypeCard";
import type { TypeContactUsSkeleton } from "./TypeContactUs";
import type { TypeOnlineResourcesSectionSkeleton } from "./TypeOnlineResourcesSection";
import type { TypeVideoSkeleton } from "./TypeVideo";

/**
 * Fields type definition for content type 'TypeJdrHealthCare'
 * @name TypeJdrHealthCareFields
 * @type {TypeJdrHealthCareFields}
 * @memberof TypeJdrHealthCare
 */
export interface TypeJdrHealthCareFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
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
     * Field type definition for field 'hero' (Hero)
     * @name Hero
     * @localized false
     */
    hero: EntryFieldTypes.EntryLink<TypeCardSkeleton>;
    /**
     * Field type definition for field 'mediaSection' (Media section)
     * @name Media section
     * @localized false
     */
    mediaSection?: EntryFieldTypes.EntryLink<TypeCardSkeleton | TypeVideoSkeleton>;
    /**
     * Field type definition for field 'banner' (Banner)
     * @name Banner
     * @localized false
     */
    banner?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'accordionSection' (Accordion Section)
     * @name Accordion Section
     * @localized false
     */
    accordionSection?: EntryFieldTypes.EntryLink<TypeAccordionSectionSkeleton>;
    /**
     * Field type definition for field 'onlineResourcesSection' (Online Resources section)
     * @name Online Resources section
     * @localized false
     */
    onlineResourcesSection?: EntryFieldTypes.EntryLink<TypeOnlineResourcesSectionSkeleton>;
    /**
     * Field type definition for field 'contactUsSection' (Contact us Section)
     * @name Contact us Section
     * @localized false
     */
    contactUsSection?: EntryFieldTypes.EntryLink<TypeContactUsSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'jdrHealthCare' (JDR healthCare)
 * @name TypeJdrHealthCareSkeleton
 * @type {TypeJdrHealthCareSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:34.660Z
 * @version 1
 */
export type TypeJdrHealthCareSkeleton = EntrySkeletonType<TypeJdrHealthCareFields, "jdrHealthCare">;
/**
 * Entry type definition for content type 'jdrHealthCare' (JDR healthCare)
 * @name TypeJdrHealthCare
 * @type {TypeJdrHealthCare}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:34.660Z
 * @version 1
 */
export type TypeJdrHealthCare<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeJdrHealthCareSkeleton, Modifiers, Locales>;

export function isTypeJdrHealthCare<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeJdrHealthCare<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'jdrHealthCare'
}

export type TypeJdrHealthCareWithoutLinkResolutionResponse = TypeJdrHealthCare<"WITHOUT_LINK_RESOLUTION">;
export type TypeJdrHealthCareWithoutUnresolvableLinksResponse = TypeJdrHealthCare<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeJdrHealthCareWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeJdrHealthCare<"WITH_ALL_LOCALES", Locales>;
export type TypeJdrHealthCareWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeJdrHealthCare<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeJdrHealthCareWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeJdrHealthCare<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
