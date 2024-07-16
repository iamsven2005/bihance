export interface AttendanceRow {
    Date: string;
    'Check-in Time': string;
    'Check-out Time': string;
    'Time Difference (hours)': number;
    'Pay (per hour)': number;
    'Due Payment': number;
    Location: string;
  }
  
  export const exportToCsv = (filename: string, rows: AttendanceRow[]) => {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]) as Array<keyof AttendanceRow>;
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          const cell = row[k] === null || row[k] === undefined ? '' : row[k];
          const cellString = cell.toString().replace(/"/g, '""');
          return `"${cellString}"`;
        }).join(separator);
      }).join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  