import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeVsAccordion'
 * @name TypeVsAccordionFields
 * @type {TypeVsAccordionFields}
 * @memberof TypeVsAccordion
 */
export interface TypeVsAccordionFields {
    /**
     * Field type definition for field 'content' (Content)
     * @name Content
     * @localized true
     */
    content?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'accordionTitle' (Accordion Title)
     * @name Accordion Title
     * @localized false
     */
    accordionTitle: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'summary' (Summary)
     * @name Summary
     * @localized true
     */
    summary: EntryFieldTypes.Symbol;
}

/**
 * Entry skeleton type definition for content type 'vsAccordion' (VS Accordion)
 * @name TypeVsAccordionSkeleton
 * @type {TypeVsAccordionSkeleton}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:43:12.296Z
 * @version 3
 */
export type TypeVsAccordionSkeleton = EntrySkeletonType<TypeVsAccordionFields, "vsAccordion">;
/**
 * Entry type definition for content type 'vsAccordion' (VS Accordion)
 * @name TypeVsAccordion
 * @type {TypeVsAccordion}
 * @author 1j74bEc1jHzibf6HnTruyr
 * @since 2026-02-07T17:43:12.296Z
 * @version 3
 */
export type TypeVsAccordion<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVsAccordionSkeleton, Modifiers, Locales>;

export function isTypeVsAccordion<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVsAccordion<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'vsAccordion'
}

export type TypeVsAccordionWithoutLinkResolutionResponse = TypeVsAccordion<"WITHOUT_LINK_RESOLUTION">;
export type TypeVsAccordionWithoutUnresolvableLinksResponse = TypeVsAccordion<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVsAccordionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVsAccordion<"WITH_ALL_LOCALES", Locales>;
export type TypeVsAccordionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVsAccordion<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVsAccordionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVsAccordion<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
