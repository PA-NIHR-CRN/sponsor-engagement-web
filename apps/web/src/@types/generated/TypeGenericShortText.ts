import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from 'contentful'

/**
 * Fields type definition for content type 'TypeGenericShortText'
 * @name TypeGenericShortTextFields
 * @type {TypeGenericShortTextFields}
 * @memberof TypeGenericShortText
 */
export interface TypeGenericShortTextFields {
  /**
   * Field type definition for field 'entryTitle' (title)
   * @name title
   * @localized false
   */
  entryTitle?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'shortText' (shortText)
   * @name shortText
   * @localized false
   */
  shortText?: EntryFieldTypes.Symbol
}

/**
 * Entry skeleton type definition for content type 'genericShortText' (Generic Short Text)
 * @name TypeGenericShortTextSkeleton
 * @type {TypeGenericShortTextSkeleton}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:22.555Z
 * @version 1
 */
export type TypeGenericShortTextSkeleton = EntrySkeletonType<TypeGenericShortTextFields, 'genericShortText'>
/**
 * Entry type definition for content type 'genericShortText' (Generic Short Text)
 * @name TypeGenericShortText
 * @type {TypeGenericShortText}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:22.555Z
 * @version 1
 */
export type TypeGenericShortText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<
  TypeGenericShortTextSkeleton,
  Modifiers,
  Locales
>
