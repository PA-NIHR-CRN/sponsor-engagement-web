import { render, screen, within } from '@testing-library/react'
import { Table } from '.'

test('Table', () => {
  render(
    <Table className="test-class">
      <Table.Caption>Test table</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.CellHeader column>Column 1 header</Table.CellHeader>
          <Table.CellHeader column>Column 2 header</Table.CellHeader>
          <Table.CellHeader column>Column 3 header</Table.CellHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.CellHeader>Row 1 header</Table.CellHeader>
          <Table.Cell>Row 1, cell 1</Table.Cell>
          <Table.Cell>Row 1, cell 2</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Row 2 header</Table.CellHeader>
          <Table.Cell>Row 2, cell 1</Table.Cell>
          <Table.Cell>Row 2, cell 2</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )

  const table = screen.getByRole('table', { name: 'Test table' })
  expect(table).toHaveClass('test-class')

  const columnHeaders = within(table).getAllByRole('columnheader')

  expect(columnHeaders.map((header) => header.textContent)).toEqual([
    'Column 1 header',
    'Column 2 header',
    'Column 3 header',
  ])

  const rowHeaders = within(table).getAllByRole('rowheader')

  expect(rowHeaders.map((header) => header.textContent)).toEqual(['Row 1 header', 'Row 2 header'])

  const rowCells = within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent)
    )

  expect(rowCells).toEqual([
    ['Row 1, cell 1', 'Row 1, cell 2'],
    ['Row 2, cell 1', 'Row 2, cell 2'],
  ])
})
