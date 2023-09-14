import { ServiceType } from '@/constants'

export type ServiceType = typeof ServiceType
export type ServiceTypes = ServiceType[keyof ServiceType]
