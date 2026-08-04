import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeCardSkeleton } from "./TypeCard";
import type { TypeCarouselSkeleton } from "./TypeCarousel";
import type { TypeOrderedListSectionSkeleton } from "./TypeOrderedListSection";
import type { TypeTextSectionSkeleton } from "./TypeTextSection";
import type { TypeVideoSkeleton } from "./TypeVideo";

/**
 * Fields type definition for content type 'TypeCampaignPage'
 * @name TypeCampaignPageFields
 * @type {TypeCampaignPageFields}
 * @memberof TypeCampaignPage
 */
export interface TypeCampaignPageFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title: EntryFieldTypes.Symbol;
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
     * Field type definition for field 'hero' (Hero)
     * @name Hero
     * @localized true
     */
    hero?: EntryFieldTypes.EntryLink<TypeCardSkeleton>;
    /**
     * Field type definition for field 'videoSection' (Video Section)
     * @name Video Section
     * @localized true
     */
    videoSection?: EntryFieldTypes.EntryLink<TypeVideoSkeleton>;
    /**
     * Field type definition for field 'textSection1' (Text Section 1)
     * @name Text Section 1
     * @localized true
     */
    textSection1: EntryFieldTypes.EntryLink<TypeTextSectionSkeleton>;
    /**
     * Field type definition for field 'orderListSection' (Ordered List Section)
     * @name Ordered List Section
     * @localized true
     */
    orderListSection?: EntryFieldTypes.EntryLink<TypeOrderedListSectionSkeleton>;
    /**
     * Field type definition for field 'textSection2' (Text Section 2)
     * @name Text Section 2
     * @localized true
     */
    textSection2?: EntryFieldTypes.EntryLink<TypeTextSectionSkeleton>;
    /**
     * Field type definition for field 'carouselSection' (Carousel Section)
     * @name Carousel Section
     * @localized true
     */
    carouselSection?: EntryFieldTypes.EntryLink<TypeCarouselSkeleton>;
    /**
     * Field type definition for field 'textSection3' (Text Section 3)
     * @name Text Section 3
     * @localized true
     */
    textSection3: EntryFieldTypes.EntryLink<TypeTextSectionSkeleton>;
    /**
     * Field type definition for field 'cardSection' (Card Section)
     * @name Card Section
     * @localized true
     */
    cardSection?: EntryFieldTypes.EntryLink<TypeCarouselSkeleton>;
    /**
     * Field type definition for field 'backToTopLinkLabel' (Back to Top Link Label)
     * @name Back to Top Link Label
     * @localized true
     */
    backToTopLinkLabel: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'campaignPage' (Campaign Page)
 * @name TypeCampaignPageSkeleton
 * @type {TypeCampaignPageSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:50.507Z
 * @version 3
 */
export type TypeCampaignPageSkeleton = EntrySkeletonType<TypeCampaignPageFields, "campaignPage">;
/**
 * Entry type definition for content type 'campaignPage' (Campaign Page)
 * @name TypeCampaignPage
 * @type {TypeCampaignPage}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:50.507Z
 * @version 3
 */
export type TypeCampaignPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeCampaignPageSkeleton, Modifiers, Locales>;

export function isTypeCampaignPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeCampaignPage<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'campaignPage'
}

export type TypeCampaignPageWithoutLinkResolutionResponse = TypeCampaignPage<"WITHOUT_LINK_RESOLUTION">;
export type TypeCampaignPageWithoutUnresolvableLinksResponse = TypeCampaignPage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeCampaignPageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeCampaignPage<"WITH_ALL_LOCALES", Locales>;
export type TypeCampaignPageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeCampaignPage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeCampaignPageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeCampaignPage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
