export const downloadCSV = (data: any[]) => {
  const headers = ['Voucher Number', 'iNat Number'];
  const csvRows = [headers.join(',')];

  data.forEach((row) => {
    const values = [row.voucherNumber, row.iNatNumber];
    csvRows.push(values.map((v) => `"${v}"`).join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'vouchers-to-inat-nums.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
