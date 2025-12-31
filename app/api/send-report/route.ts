import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import jsPDF from 'jspdf'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, checkType, formData, marketData } = await req.json()

    if (!email || !marketData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate PDF
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = margin

    // Header
    doc.setFontSize(20)
    doc.setTextColor(37, 99, 235)
    doc.text('Car Price Checker Report', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Vehicle Info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    if (checkType === 'vin') {
      doc.text(`VIN: ${formData.vin}`, margin, yPos)
      yPos += 10
    } else {
      doc.text(`Vehicle: ${formData.year} ${formData.make} ${formData.model}${formData.trim ? ` ${formData.trim}` : ''}`, margin, yPos)
      yPos += 10
      doc.text(`Mileage: ${parseInt(formData.mileage).toLocaleString()} miles`, margin, yPos)
      yPos += 10
      doc.text(`Condition: ${formData.condition}`, margin, yPos)
      yPos += 10
      if (formData.hasAccidents) {
        doc.text(`Accident History: Yes`, margin, yPos)
        yPos += 10
      }
    }

    // Car details from market data
    if (marketData.carDetails) {
      const { make, model, year } = marketData.carDetails
      if (make || model || year) {
        doc.text(`Vehicle: ${year || ''} ${make || ''} ${model || ''}`.trim(), margin, yPos)
        yPos += 10
      }
    }

    yPos += 5

    // Results
    doc.setFontSize(16)
    const resultColor = marketData.isOverpriced 
      ? [239, 68, 68] 
      : marketData.isFairPrice 
      ? [59, 130, 246] 
      : [16, 185, 129]
    doc.setTextColor(resultColor[0], resultColor[1], resultColor[2])
    const resultText = marketData.isOverpriced
      ? `OVERPRICED by $${Math.abs(marketData.difference).toLocaleString()}`
      : marketData.isFairPrice
      ? `FAIR PRICE - Within market range`
      : `GOOD DEAL - $${Math.abs(marketData.difference).toLocaleString()} below market`
    doc.text(resultText, margin, yPos)
    yPos += 15

    // Market Analysis
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Market Analysis', margin, yPos)
    yPos += 10

    doc.setFontSize(11)
    const askingPrice = checkType === 'vin' 
      ? (formData.askingPrice ? parseFloat(formData.askingPrice.toString()) : marketData.marketValue)
      : parseFloat(formData.askingPrice.toString())
    doc.text(`Asking Price: $${askingPrice.toLocaleString()}`, margin, yPos)
    yPos += 7
    doc.text(`Market Average: $${marketData.marketValue.toLocaleString()}`, margin, yPos)
    yPos += 7
    if (marketData.adjustedMarketValue && marketData.adjustedMarketValue !== marketData.marketValue) {
      doc.text(`Adjusted Market Value: $${marketData.adjustedMarketValue.toLocaleString()}`, margin, yPos)
      yPos += 7
    }
    doc.text(
      `Price Range: $${marketData.priceRange.low.toLocaleString()} - $${marketData.priceRange.high.toLocaleString()}`,
      margin,
      yPos
    )
    yPos += 7
    doc.text(`Similar Listings: ${marketData.similarListings}`, margin, yPos)
    yPos += 15

    // Adjustments
    if (marketData.adjustments && Object.keys(marketData.adjustments).length > 0) {
      doc.setFontSize(12)
      doc.text('Applied Adjustments:', margin, yPos)
      yPos += 8
      doc.setFontSize(10)
      if (marketData.adjustments.accident) {
        doc.text(`Accident History: -${Math.abs(marketData.adjustments.accident).toLocaleString()}`, margin, yPos)
        yPos += 7
      }
      if (marketData.adjustments.condition) {
        doc.text(`Condition: -${Math.abs(marketData.adjustments.condition).toLocaleString()}`, margin, yPos)
        yPos += 7
      }
      if (marketData.adjustments.mileage) {
        doc.text(`Mileage: -${Math.abs(marketData.adjustments.mileage).toLocaleString()}`, margin, yPos)
        yPos += 7
      }
      yPos += 5
    }

    // Recommendation
    doc.setFontSize(12)
    doc.text('Recommendation:', margin, yPos)
    yPos += 8
    doc.setFontSize(10)
    const splitText = doc.splitTextToSize(marketData.recommendation, pageWidth - 2 * margin)
    doc.text(splitText, margin, yPos)
    yPos += splitText.length * 5 + 10

    // Negotiation Range
    if (marketData.negotiationRange) {
      doc.setFontSize(12)
      doc.text('Negotiation Range:', margin, yPos)
      yPos += 8
      doc.setFontSize(11)
      doc.text(
        `$${marketData.negotiationRange.low.toLocaleString()} - $${marketData.negotiationRange.high.toLocaleString()}`,
        margin,
        yPos
      )
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Generated by Car Price Checker - ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )

    // Convert PDF to base64
    const pdfBase64 = doc.output('datauristring').split(',')[1]

    // Build email HTML
    const resultHtml = marketData.isOverpriced
      ? `<div class="result-box" style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <div class="result-title" style="font-size: 24px; font-weight: bold; color: #991b1b; margin-bottom: 10px;">
            ⚠️ OVERPRICED by $${Math.abs(marketData.difference).toLocaleString()}
          </div>
          <p>${marketData.recommendation}</p>
        </div>`
      : marketData.isFairPrice
      ? `<div class="result-box" style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <div class="result-title" style="font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 10px;">
            ✓ FAIR PRICE - Within market range
          </div>
          <p>${marketData.recommendation}</p>
        </div>`
      : `<div class="result-box" style="background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <div class="result-title" style="font-size: 24px; font-weight: bold; color: #065f46; margin-bottom: 10px;">
            ✅ GOOD DEAL - $${Math.abs(marketData.difference).toLocaleString()} below market
          </div>
          <p>${marketData.recommendation}</p>
        </div>`

    const vehicleInfoHtml = checkType === 'vin'
      ? `<div class="info-row"><span class="info-label">VIN:</span><span class="info-value">${formData.vin}</span></div>`
      : `<div class="info-row"><span class="info-label">Vehicle:</span><span class="info-value">${formData.year} ${formData.make} ${formData.model}${formData.trim ? ` ${formData.trim}` : ''}</span></div>
         <div class="info-row"><span class="info-label">Mileage:</span><span class="info-value">${parseInt(formData.mileage).toLocaleString()} miles</span></div>
         <div class="info-row"><span class="info-label">Condition:</span><span class="info-value">${formData.condition}</span></div>
         <div class="info-row"><span class="info-label">Accidents:</span><span class="info-value">${formData.hasAccidents ? 'Yes' : 'No'}</span></div>`

    const adjustmentsHtml = marketData.adjustments && Object.keys(marketData.adjustments).length > 0
      ? `<div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 5px; padding: 15px; margin: 20px 0;">
          <h3 style="font-weight: bold; color: #92400e; margin-bottom: 10px;">Applied Adjustments</h3>
          ${marketData.adjustments.accident ? `<p style="color: #78350f; margin: 5px 0;">• Accident History: -$${Math.abs(marketData.adjustments.accident).toLocaleString()}</p>` : ''}
          ${marketData.adjustments.condition ? `<p style="color: #78350f; margin: 5px 0;">• Condition: -$${Math.abs(marketData.adjustments.condition).toLocaleString()}</p>` : ''}
          ${marketData.adjustments.mileage ? `<p style="color: #78350f; margin: 5px 0;">• Mileage: -$${Math.abs(marketData.adjustments.mileage).toLocaleString()}</p>` : ''}
        </div>`
      : ''

    const negotiationHtml = marketData.negotiationRange
      ? `<div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 5px; padding: 15px; margin: 20px 0;">
          <h3 style="font-weight: bold; color: #1e40af; margin-bottom: 10px;">💡 Negotiation Recommendation</h3>
          <p style="color: #1e3a8a; margin: 5px 0;"><strong>Our Recommendation:</strong> Offer $${marketData.negotiationRange.low.toLocaleString()}</p>
          <p style="color: #1e3a8a; margin: 5px 0;"><strong>Negotiation Range:</strong> $${marketData.negotiationRange.low.toLocaleString()} - $${marketData.negotiationRange.high.toLocaleString()}</p>
        </div>`
      : ''

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: 600; color: #6b7280; }
            .info-value { color: #111827; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Car Price Checker Report</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your car price analysis is complete. Here are the results:</p>
              
              ${resultHtml}

              <h2 style="margin-top: 30px; margin-bottom: 15px;">Market Analysis</h2>
              
              ${vehicleInfoHtml}
              <div class="info-row">
                <span class="info-label">Asking Price:</span>
                <span class="info-value">$${askingPrice.toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Market Average:</span>
                <span class="info-value">$${marketData.marketValue.toLocaleString()}</span>
              </div>
              ${marketData.adjustedMarketValue && marketData.adjustedMarketValue !== marketData.marketValue
                ? `<div class="info-row">
                    <span class="info-label">Adjusted Market Value:</span>
                    <span class="info-value">$${marketData.adjustedMarketValue.toLocaleString()}</span>
                  </div>`
                : ''}
              <div class="info-row">
                <span class="info-label">Price Range:</span>
                <span class="info-value">$${marketData.priceRange.low.toLocaleString()} - $${marketData.priceRange.high.toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Similar Listings:</span>
                <span class="info-value">${marketData.similarListings} vehicles</span>
              </div>

              ${adjustmentsHtml}
              ${negotiationHtml}

              <p style="margin-top: 30px;">A detailed PDF report is attached to this email.</p>
              
              <div class="footer">
                <p>Thank you for using Car Price Checker!</p>
                <p>© 2024 Car Price Checker. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not set in environment variables, skipping email send')
      return NextResponse.json({ success: false, error: 'RESEND_API_KEY not configured' })
    }

    console.log('📧 Attempting to send email to:', email)

    const filename = checkType === 'vin'
      ? `car-price-report-${formData.vin}.pdf`
      : `car-price-report-${formData.year}-${formData.make}-${formData.model}.pdf`

    const { data, error } = await resend.emails.send({
      from: 'Car Price Checker <onboarding@resend.dev>', // Update with your verified domain
      to: email,
      subject: `Your Car Price Check Report${checkType === 'vin' ? ` - ${formData.vin}` : ''}`,
      html: emailHtml,
      attachments: [
        {
          filename,
          content: pdfBase64,
        },
      ],
    })

    if (error) {
      console.error('❌ Resend API error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `Failed to send email: ${error.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    console.log('✅ Email sent successfully! Message ID:', data?.id)
    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error: any) {
    console.error('Error in send-report:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send report' },
      { status: 500 }
    )
  }
}
