import * as XLSX from 'xlsx';

export const exportToExcel = (data, name) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const timestamp = new Date().getTime().toString();

  XLSX.writeFile(workbook, `${name}-${timestamp}.xlsx`);
};
