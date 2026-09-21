/** Quote a CSV cell and neutralise spreadsheet formula injection (=, +, -, @ prefixes). */
export function toCsvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsvRow(values: string[]): string {
  return values.map(toCsvCell).join(",");
}
