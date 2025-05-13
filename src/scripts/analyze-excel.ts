import * as XLSX from 'xlsx';
import * as path from 'path';

const analyzeExcel = () => {
  // Leer el archivo Excel
  const workbook = XLSX.readFile(path.join(__dirname, '../../data/Technical Challenge Solum Health.xlsx'));
  
  // Obtener los nombres de las hojas
  const sheetNames = workbook.SheetNames;
  console.log('Hojas encontradas:', sheetNames);

  // Analizar cada hoja
  sheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Obtener los encabezados (primera fila)
    const headers = data[0];
    console.log(`\nEstructura de la hoja "${sheetName}":`);
    console.log('Encabezados:', headers);
    
    // Mostrar algunos ejemplos de datos
    if (data.length > 1) {
      console.log('\nEjemplo de datos (primera fila):');
      console.log(data[1]);
    }
  });
};

analyzeExcel(); 