export async function generateInventoryPDF(products: any[]) {
  // Dynamic import to avoid SSR issues
  const jsPDF = (await import("jspdf")).default
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Header
  doc.setFontSize(16)
  doc.text("Inventaire des Produits", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // Date
  doc.setFontSize(10)
  doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 20, yPosition)
  yPosition += 10

  // Table header
  doc.setFontSize(9)
  doc.setFont(undefined, "bold")
  const headers = ["Code", "Produit", "Catégorie", "Stock", "Prix", "Garantie"]
  const columnWidths = [25, 50, 35, 20, 25, 20]
  let xPosition = 20

  headers.forEach((header, i) => {
    doc.text(header, xPosition, yPosition)
    xPosition += columnWidths[i]
  })

  yPosition += 8
  doc.setDrawColor(200)
  doc.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 5

  // Table rows
  doc.setFont(undefined, "normal")
  products.forEach((product) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
    }

    xPosition = 20
    const rowData = [
      product.codeProduit,
      product.nom.substring(0, 20),
      product.categorie?.nom || "",
      product.stock.toString(),
      `${product.prixVente}€`,
      `${product.garantieMois}m`,
    ]

    rowData.forEach((data, i) => {
      doc.text(data, xPosition, yPosition)
      xPosition += columnWidths[i]
    })

    yPosition += 7
  })

  return doc
}
