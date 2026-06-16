import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

/**
 * Fields type definition for content type 'TypeVideo'
 * @name TypeVideoFields
 * @type {TypeVideoFields}
 * @memberof TypeVideo
 */
export interface TypeVideoFields {
    /**
     * Field type definition for field 'heading' (Heading)
     * @name Heading
     * @localized true
     */
    heading: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized true
     */
    description?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'link' (Link)
     * @name Link
     * @localized true
     */
    link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
    /**
     * Field type definition for field 'videoUrl' (Video URL)
     * @name Video URL
     * @localized true
     */
    videoUrl?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'transcript' (Transcript)
     * @name Transcript
     * @localized true
     */
    transcript?: EntryFieldTypes.Text;
}

/**
 * Entry skeleton type definition for content type 'video' (Video)
 * @name TypeVideoSkeleton
 * @type {TypeVideoSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:43.368Z
 * @version 7
 */
export type TypeVideoSkeleton = EntrySkeletonType<TypeVideoFields, "video">;
/**
 * Entry type definition for content type 'video' (Video)
 * @name TypeVideo
 * @type {TypeVideo}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:22:43.368Z
 * @version 7
 */
export type TypeVideo<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVideoSkeleton, Modifiers, Locales>;

export function isTypeVideo<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVideo<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'video'
}

export type TypeVideoWithoutLinkResolutionResponse = TypeVideo<"WITHOUT_LINK_RESOLUTION">;
export type TypeVideoWithoutUnresolvableLinksResponse = TypeVideo<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVideoWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVideo<"WITH_ALL_LOCALES", Locales>;
export type TypeVideoWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVideo<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVideoWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVideo<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
