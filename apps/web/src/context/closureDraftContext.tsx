import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { EditStudy } from '@/utils/schemas/study.schema'
import { closureDraftStorageKey } from '@/utils/storageKeys'

export type YesNo = 'YES' | 'NO'

export type ClosureDraft = {
  // Step 1 values
  studyId?: string
  cpmsId?: string
  status?: string
  actualClosureDate?: DateInputValue | null
  recruitmentTarget?: string
  actualOpeningDate?: DateInputValue | null
  plannedClosureDate?: DateInputValue | null
  LSN?: string | null
  originalValues?: EditStudy['originalValues']

  // Step 2 values
  isFinalRecruitmentTotalCorrect?: YesNo
  correctedRecruitmentTotal?: string
  didPerformanceDeliverInline?: YesNo
  performanceNoReason?: string
  furtherInformation?: string
}

type ClosureDraftContextValue = {
  draft: ClosureDraft
  setDraft: React.Dispatch<React.SetStateAction<ClosureDraft>>
  replaceDraft: (next: ClosureDraft) => void
  clearDraft: () => void
}

const ClosureDraftContext = createContext<ClosureDraftContextValue | undefined>(undefined)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const isYesNo = (value: unknown): value is YesNo => value === 'YES' || value === 'NO'

const isDateInputValue = (value: unknown): value is DateInputValue => {
  if (!isRecord(value)) return false
  return typeof value.day === 'string' && typeof value.month === 'string' && typeof value.year === 'string'
}

const asDateInputValue = (value: unknown): DateInputValue | null | undefined => {
  if (value === null || value === undefined) return value
  return isDateInputValue(value) ? value : undefined
}

const coerceClosureDraft = (value: unknown): ClosureDraft => {
  if (!isRecord(value)) return {}

  return {
    studyId: asString(value.studyId),
    cpmsId: asString(value.cpmsId),
    status: asString(value.status),

    actualClosureDate: asDateInputValue(value.actualClosureDate),
    recruitmentTarget: asString(value.recruitmentTarget),
    actualOpeningDate: asDateInputValue(value.actualOpeningDate),
    plannedClosureDate: asDateInputValue(value.plannedClosureDate),

    isFinalRecruitmentTotalCorrect: isYesNo(value.isFinalRecruitmentTotalCorrect)
      ? value.isFinalRecruitmentTotalCorrect
      : undefined,
    correctedRecruitmentTotal: asString(value.correctedRecruitmentTotal),
    didPerformanceDeliverInline: isYesNo(value.didPerformanceDeliverInline)
      ? value.didPerformanceDeliverInline
      : undefined,

    performanceNoReason: asString(value.performanceNoReason),
    furtherInformation: asString(value.furtherInformation),
  }
}

export function ClosureDraftProvider({
  children,
  studyId,
}: {
  children: React.ReactNode
  studyId: string
}) {
  const [draft, setDraft] = useState<ClosureDraft>({})

  const storageKey = useMemo(() => closureDraftStorageKey(studyId), [studyId])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey)
      if (!raw) {
        setDraft({})
        return
      }

      const parsed: unknown = JSON.parse(raw)
      setDraft(coerceClosureDraft(parsed))
    } catch {
      setDraft({})
    }
  }, [storageKey])

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(draft))
    } catch {
    }
  }, [storageKey, draft])

  const replaceDraft = (next: ClosureDraft) => {
    setDraft(next)
  }

  const clearDraft = () => {
    setDraft({})
    try {
      sessionStorage.removeItem(storageKey)
    } catch {
    }
  }

  const value = useMemo<ClosureDraftContextValue>(
    () => ({ draft, setDraft, replaceDraft, clearDraft }),
    [draft]
  )

  return <ClosureDraftContext.Provider value={value}>{children}</ClosureDraftContext.Provider>
}

export function useClosureDraft() {
  const ctx = useContext(ClosureDraftContext)
  if (!ctx) {
    throw new Error('useClosureDraft must be used within a <ClosureDraftProvider />')
  }
  return ctx
}