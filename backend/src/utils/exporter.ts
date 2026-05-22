import * as XLSX from "xlsx";

export const toCsv = (rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")]
    .concat(
      rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : `${value ?? ""}`;
          })
          .join(",")
      )
    )
    .join("\n");
  return csv;
};

export const toXlsxBuffer = (rows: Record<string, unknown>[], sheetName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
