type PageType = number | '...'

export function generateTruncatedPagination(totalPages: number, currentPage: number) {
  const result: PageType[] = []

  const fixedLength = 7 // Desired fixed length

  // Logic to determine which pages should be shown without ellipses
  if (totalPages <= fixedLength) {
    // If total pages is less than or equal to the fixed length, display all pages
    for (let i = 1; i <= totalPages; i++) {
      result.push(i)
    }
  } else if (currentPage <= (fixedLength - 1) / 2) {
    for (let i = 1; i <= fixedLength - 2 && i < totalPages; i++) {
      // Ensure i doesn't exceed totalPages
      result.push(i)
    }
    if (result[result.length - 1] !== totalPages - 1) {
      result.push('...')
      result.push(totalPages)
    } else if (result[result.length - 1] !== totalPages) {
      result.push(totalPages)
    }
  } else if (currentPage >= totalPages - (fixedLength - 3) / 2) {
    result.push(1)
    result.push('...')
    for (let i = totalPages - fixedLength + 3; i <= totalPages; i++) {
      result.push(i)
    }
  } else {
    result.push(1)
    result.push('...')
    const halfRange = Math.floor((fixedLength - 4) / 2)
    for (let i = currentPage - halfRange; i <= currentPage + halfRange; i++) {
      result.push(i)
    }
    result.push('...')
    result.push(totalPages)
  }

  return result
}
