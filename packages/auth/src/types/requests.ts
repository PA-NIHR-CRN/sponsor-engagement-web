import type { Wso2GroupOperation } from '../constants/constants'

export interface AddOperation {
  op: Wso2GroupOperation.Add
  value: {
    members: {
      display: string
      value: string
    }[]
  }
}

export interface RemoveOperation {
  op: Wso2GroupOperation.Remove
  path: string
}

export interface GroupUpdateData {
  schemas: string[]
  Operations: (AddOperation | RemoveOperation)[]
}
