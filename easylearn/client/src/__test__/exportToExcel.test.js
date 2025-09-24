import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as XLSX from 'xlsx';
import { exportToExcel } from '../utils/xlsxExport.js'; // adjust path

vi.mock('xlsx', async () => {
const actual = await vi.importActual('xlsx');
return {
...actual,
writeFile: vi.fn(),
};
});

describe('exportToExcel', () => {
beforeEach(() => {
vi.clearAllMocks();
});

it('creates a workbook and calls XLSX.writeFile with correct filename', () => {
const data = [
{ name: 'Tamara', score: 90 },
{ name: 'Andrea', score: 80 },
];
const name = 'TestExport';

vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

exportToExcel(data, name);

expect(XLSX.writeFile).toHaveBeenCalledTimes(1);

const [workbook, fileName] = XLSX.writeFile.mock.calls[0];

expect(fileName).toBe('TestExport-1735689600000.xlsx');

expect(workbook.SheetNames).toContain('Sheet1');
});
});