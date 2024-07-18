import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from 'contentful'

/**
 * Fields type definition for content type 'TypeBanner'
 * @name TypeBannerFields
 * @type {TypeBannerFields}
 * @memberof TypeBanner
 */
export interface TypeBannerFields {
  /**
   * Field type definition for field 'entryTitle' (Entry Title)
   * @name Entry Title
   * @localized false
   */
  entryTitle?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'bannerTitle' (Banner Title)
   * @name Banner Title
   * @localized false
   */
  bannerTitle?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'bannerBody' (Banner Body)
   * @name Banner Body
   * @localized false
   */
  bannerBody?: EntryFieldTypes.RichText
}

/**
 * Entry skeleton type definition for content type 'banner' (Banner)
 * @name TypeBannerSkeleton
 * @type {TypeBannerSkeleton}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:23.593Z
 * @version 1
 */
export type TypeBannerSkeleton = EntrySkeletonType<TypeBannerFields, 'banner'>
/**
 * Entry type definition for content type 'banner' (Banner)
 * @name TypeBanner
 * @type {TypeBanner}
 * @author 2rrNVCpeOdsG9LZyGrr8NG
 * @since 2022-03-09T10:50:23.593Z
 * @version 1
 */
export type TypeBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<
  TypeBannerSkeleton,
  Modifiers,
  Locales
>
