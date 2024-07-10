import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TableCaption } from './TableCaption'
import { TableCellHeader } from './TableCellHeader'
import { TableCell } from './TableCell'
import { TableRow } from './TableRow'

const TableNamespace = Object.assign(Table, {
  Caption: TableCaption,
  Body: TableBody,
  Header: TableHeader,
  Row: TableRow,
  Cell: TableCell,
  CellHeader: TableCellHeader,
})

export { TableNamespace as Table }
