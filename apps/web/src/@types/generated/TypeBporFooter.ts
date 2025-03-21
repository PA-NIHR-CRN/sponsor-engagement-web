import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from 'contentful'

/**
 * Fields type definition for content type 'TypeBporFooter'
 * @name TypeBporFooterFields
 * @type {TypeBporFooterFields}
 * @memberof TypeBporFooterFields
 */
export interface TypeBporFooterFields {
  /**
   * Field type definition for field 'entryTitle' (Entry Title)
   * @name Entry Title
   * @localized false
   */
  entryTitle?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'BporFooter' (BporFooter)
   * @name Sponsor Engagement Request - BPoR
   * @localized false
   */
  	
  richText?: EntryFieldTypes.RichText
}

/**
 * Entry skeleton type definition for content type 'BporFooter' (Text for BporFooter)
 * @name TypeBporFooterSkeleton
 * @type {TypeBporFooterSkeleton}
//  * @author 2rrNVCpeOdsG9LZyGrr8NG
//  * @since 2022-03-09T10:50:23.593Z
//  * @version 4
 */
export type TypeBporFooterSkeleton = EntrySkeletonType<TypeBporFooterFields, 'bporFooter'>
/**
 * Entry type definition for content type 'BporFooter' (Text for BporFooter)
 * @name TypeBporFooter
 * @type {TypeBporFooter}
//  * @author 2rrNVCpeOdsG9LZyGrr8NG
//  * @since 2022-03-09T10:50:23.593Z
//  * @version 4
 */

export type TypeBporFooter<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<
TypeBporFooterSkeleton,
  Modifiers,
  Locales
>
