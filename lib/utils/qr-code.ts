/**
 * QR Code Generation Utilities
 * Handles worker QR code generation and validation
 */

import QRCode from 'qrcode'
import crypto from 'crypto'

/**
 * Generate a unique QR code hash for a worker
 * Format: worker-{uuid}-{random}
 */
export function generateQRCodeHash(workerId: string): string {
  const random = crypto.randomBytes(8).toString('hex')
  const hash = `worker-${workerId}-${random}`
  return hash
}

/**
 * Generate QR code image as Data URL
 * Returns base64-encoded PNG image
 */
export async function generateQRCodeImage(data: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Validate QR code hash format
 */
export function isValidQRCodeHash(hash: string): boolean {
  const pattern = /^worker-[a-f0-9-]+-[a-f0-9]+$/
  return pattern.test(hash)
}
