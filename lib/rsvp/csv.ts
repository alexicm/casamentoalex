const FORMULA_RE = /^[=+\-@|\t\r]/;

export function protectCsvCell(value: string): string {
  let next = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (FORMULA_RE.test(next)) {
    next = `'${next}`;
  }
  if (/[",\n]/.test(next)) {
    return `"${next.replace(/"/g, '""')}"`;
  }
  return next;
}

export function toCsv(headers: string[], rows: string[][]): string {
  const lines = [
    headers.map(protectCsvCell).join(","),
    ...rows.map((row) => row.map(protectCsvCell).join(",")),
  ];
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
