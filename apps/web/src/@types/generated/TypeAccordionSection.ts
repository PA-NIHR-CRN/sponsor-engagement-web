import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionSkeleton } from "./TypeAccordion";

/**
 * Fields type definition for content type 'TypeAccordionSection'
 * @name TypeAccordionSectionFields
 * @type {TypeAccordionSectionFields}
 * @memberof TypeAccordionSection
 */
export interface TypeAccordionSectionFields {
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized false
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized false
     */
    description?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'accordions' (Accordions)
     * @name Accordions
     * @localized false
     */
    accordions: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAccordionSkeleton>>;
}

/**
 * Entry skeleton type definition for content type 'accordionSection' (Accordion Section)
 * @name TypeAccordionSectionSkeleton
 * @type {TypeAccordionSectionSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:36.040Z
 * @version 1
 */
export type TypeAccordionSectionSkeleton = EntrySkeletonType<TypeAccordionSectionFields, "accordionSection">;
/**
 * Entry type definition for content type 'accordionSection' (Accordion Section)
 * @name TypeAccordionSection
 * @type {TypeAccordionSection}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:36.040Z
 * @version 1
 */
export type TypeAccordionSection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAccordionSectionSkeleton, Modifiers, Locales>;

export function isTypeAccordionSection<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeAccordionSection<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'accordionSection'
}

export type TypeAccordionSectionWithoutLinkResolutionResponse = TypeAccordionSection<"WITHOUT_LINK_RESOLUTION">;
export type TypeAccordionSectionWithoutUnresolvableLinksResponse = TypeAccordionSection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeAccordionSectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionSection<"WITH_ALL_LOCALES", Locales>;
export type TypeAccordionSectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionSection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeAccordionSectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionSection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
