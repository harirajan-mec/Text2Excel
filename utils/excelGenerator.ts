import * as XLSX from 'xlsx';
import { ExtractedData, ExcelGenerationConfig } from '../types';

export const generateAndDownloadExcel = (
  data: ExtractedData,
  config: ExcelGenerationConfig = { includeSummary: true, autoFilter: true }
) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Prepare the data for the sheet
  // We start with the columns (headers) and then add the rows
  const sheetData = [data.columns, ...data.rows];

  // Create a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Basic Formatting adjustment: Set column widths based on content length
  // This is a rough approximation
  const colWidths = data.columns.map((col, i) => {
    let maxLength = col.length;
    // Check first 10 rows to estimate width
    for (let r = 0; r < Math.min(data.rows.length, 10); r++) {
      const cellValue = data.rows[r][i];
      if (cellValue) {
        const len = String(cellValue).length;
        if (len > maxLength) maxLength = len;
      }
    }
    return { wch: Math.min(maxLength + 5, 50) }; // Add padding, cap at 50 chars
  });

  worksheet['!cols'] = colWidths;

  // Add AutoFilter if requested
  if (config.autoFilter && data.rows.length > 0) {
    worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(XLSX.utils.decode_range(worksheet['!ref'] || 'A1')) };
  }

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted Data");

  // Handle Summary Sheet if exists
  if (config.includeSummary && data.summary) {
    const summaryData = [["Summary"], [data.summary]];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Info");
  }

  // Generate file name
  const safeFilename = (data.filename || "extracted_data").replace(/[^a-z0-9-_]/gi, '_');
  
  // Trigger download
  XLSX.writeFile(workbook, `${safeFilename}.xlsx`);
};