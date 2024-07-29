import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from 'contentful'

/**
 * Fields type definition for content type 'TypeGenericRichTextLinksOnly'
 * @name TypeGenericRichTextLinksOnlyFields
 * @type {TypeGenericRichTextLinksOnlyFields}
 * @memberof TypeGenericRichTextLinksOnly
 */
export interface TypeGenericRichTextLinksOnlyFields {
  /**
   * Field type definition for field 'title' (title)
   * @name title
   * @localized false
   */
  title?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'richTextLinksOnly' (richTextLinksOnly)
   * @name richTextLinksOnly
   * @localized false
   */
  richTextLinksOnly?: EntryFieldTypes.RichText
}

/**
 * Entry skeleton type definition for content type 'genericRichTextLinksOnly' (Generic Rich Text (Links only))
 * @name TypeGenericRichTextLinksOnlySkeleton
 * @type {TypeGenericRichTextLinksOnlySkeleton}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:24.143Z
 * @version 1
 */
export type TypeGenericRichTextLinksOnlySkeleton = EntrySkeletonType<
  TypeGenericRichTextLinksOnlyFields,
  'genericRichTextLinksOnly'
>
/**
 * Entry type definition for content type 'genericRichTextLinksOnly' (Generic Rich Text (Links only))
 * @name TypeGenericRichTextLinksOnly
 * @type {TypeGenericRichTextLinksOnly}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:24.143Z
 * @version 1
 */
export type TypeGenericRichTextLinksOnly<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeGenericRichTextLinksOnlySkeleton, Modifiers, Locales>
