import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'

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

const STORAGE_KEY = 'se:closureDraft:v1'

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

export function ClosureDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<ClosureDraft>({})

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      setDraft(coerceClosureDraft(parsed))
    } catch {
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
    }
  }, [draft])

  const replaceDraft = (next: ClosureDraft) => {
    setDraft(next)
  }

  const clearDraft = () => {
    setDraft({})
    try {
      sessionStorage.removeItem(STORAGE_KEY)
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