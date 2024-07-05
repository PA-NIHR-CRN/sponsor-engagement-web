import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from 'contentful'

/**
 * Fields type definition for content type 'TypeGenericRichText'
 * @name TypeGenericRichTextFields
 * @type {TypeGenericRichTextFields}
 * @memberof TypeGenericRichText
 */
export interface TypeGenericRichTextFields {
  /**
   * Field type definition for field 'title' (Title)
   * @name Title
   * @localized false
   */
  title?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'richText' (richText)
   * @name richText
   * @localized false
   */
  richText?: EntryFieldTypes.RichText
}

/**
 * Entry skeleton type definition for content type 'genericRichText' (Generic Rich Text)
 * @name TypeGenericRichTextSkeleton
 * @type {TypeGenericRichTextSkeleton}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:21.864Z
 * @version 1
 */
export type TypeGenericRichTextSkeleton = EntrySkeletonType<TypeGenericRichTextFields, 'genericRichText'>
/**
 * Entry type definition for content type 'genericRichText' (Generic Rich Text)
 * @name TypeGenericRichText
 * @type {TypeGenericRichText}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:21.864Z
 * @version 1
 */
export type TypeGenericRichText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<
  TypeGenericRichTextSkeleton,
  Modifiers,
  Locales
>
