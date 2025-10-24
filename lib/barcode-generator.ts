export function generateBarcode(productCode: string): string {
  // Simulate barcode generation - in production, use a library like jsbarcode
  const timestamp = Date.now().toString().slice(-6)
  const barcode = `${productCode}${timestamp}`.padEnd(13, "0").slice(0, 13)
  return barcode
}

export function formatBarcode(barcode: string): string {
  // Format barcode for display (e.g., 123-456-789-012)
  return barcode.replace(/(\d{3})(?=\d)/g, "$1-")
}
