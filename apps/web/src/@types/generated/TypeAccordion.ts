import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeAccordion'
 * @name TypeAccordionFields
 * @type {TypeAccordionFields}
 * @memberof TypeAccordion
 */
export interface TypeAccordionFields {
    /**
     * Field type definition for field 'accordionTitle' (Accordion Title)
     * @name Accordion Title
     * @localized false
     */
    accordionTitle: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'content' (content)
     * @name content
     * @localized false
     */
    content: EntryFieldTypes.Text;
}

/**
 * Entry skeleton type definition for content type 'accordion' (accordion)
 * @name TypeAccordionSkeleton
 * @type {TypeAccordionSkeleton}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:35.580Z
 * @version 1
 */
export type TypeAccordionSkeleton = EntrySkeletonType<TypeAccordionFields, "accordion">;
/**
 * Entry type definition for content type 'accordion' (accordion)
 * @name TypeAccordion
 * @type {TypeAccordion}
 * @author 74dRNHIw06jXMrW8vfnjVl
 * @since 2026-03-02T11:30:35.580Z
 * @version 1
 */
export type TypeAccordion<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAccordionSkeleton, Modifiers, Locales>;

export function isTypeAccordion<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeAccordion<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'accordion'
}

export type TypeAccordionWithoutLinkResolutionResponse = TypeAccordion<"WITHOUT_LINK_RESOLUTION">;
export type TypeAccordionWithoutUnresolvableLinksResponse = TypeAccordion<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeAccordionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordion<"WITH_ALL_LOCALES", Locales>;
export type TypeAccordionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordion<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeAccordionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordion<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
