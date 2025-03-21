import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from 'contentful'

/**
 * Fields type definition for content type 'TypeBanner'
 * @name TypePageFields
 * @type {TypePageFields}
 * @memberof TypePageFields
 */
export interface TypePageFields {
    /**
   * Field type definition for field 'entryTitle' (Entry Title)
   * @name Entry Title
   * @localized false
   */
  entryTitle?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'mainBodyText' (Main Body Text)
   * @name Sponsor Engagement Request Support
   * @localized false
   */
  richText?: EntryFieldTypes.RichText
}

/**
 * Entry skeleton type definition for content type 'page'
 * @name TypePageSkeleton
 * @type {TypePageSkeleton}
//  * @author 2rrNVCpeOdsG9LZyGrr8NG
//  * @since 2022-03-09T10:50:23.593Z
//  * @version 4
 */
export type TypePageSkeleton = EntrySkeletonType<TypePageFields, 'page'>
/**
 * Entry type definition for content type 'page' 
 * @name TypePage
 * @type {TypePage}
//  * @author 2rrNVCpeOdsG9LZyGrr8NG
//  * @since 2022-03-09T10:50:23.593Z
//  * @version 4
 */

export type TypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<
TypePageSkeleton,
  Modifiers,
  Locales
>
