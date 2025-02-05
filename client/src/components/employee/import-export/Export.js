import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";


export const exportToCSV = (employees) => {
    const csv = Papa.unparse(employees);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "employees.csv");
};

export const exportToExcel = (employees) => {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });  
    saveAs(data, "employees.xlsx");
};
