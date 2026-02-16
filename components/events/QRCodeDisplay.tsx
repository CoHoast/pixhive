'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import type { Event } from '@/lib/types/database'

interface Props {
  event: Event
}

export default function QRCodeDisplay({ event }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/e/${event.slug}`

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, uploadUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
    }
  }, [uploadUrl])

  async function copyLink() {
    await navigator.clipboard.writeText(uploadUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadQR() {
    if (!canvasRef.current) return
    
    const link = document.createElement('a')
    link.download = `${event.slug}-qr-code.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Share with Guests</h2>
        <p className="text-sm text-gray-500">Guests scan this QR code to upload photos</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* URL */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-600 text-center break-all">{uploadUrl}</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={copyLink}
          className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Link
            </>
          )}
        </button>
        <button
          onClick={downloadQR}
          className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR
        </button>
      </div>

      {/* Print Instructions */}
      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
        <h3 className="font-medium text-gray-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Pro Tips
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Print the QR code and display at your event</li>
          <li>• Add it to table cards or signage</li>
          <li>• Share the link in group chats</li>
          <li>• Include in email invitations</li>
        </ul>
      </div>

      {/* Share Options */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 text-center mb-3">Share via</p>
        <div className="flex justify-center space-x-4">
          <ShareButton
            href={`https://wa.me/?text=${encodeURIComponent(`Upload photos to ${event.name}! ${uploadUrl}`)}`}
            label="WhatsApp"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            }
          />
          <ShareButton
            href={`mailto:?subject=${encodeURIComponent(`Upload photos to ${event.name}`)}&body=${encodeURIComponent(`Upload your photos here: ${uploadUrl}`)}`}
            label="Email"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <ShareButton
            href={`sms:?body=${encodeURIComponent(`Upload photos to ${event.name}! ${uploadUrl}`)}`}
            label="SMS"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
}

function ShareButton({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 transition"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mb-1">
        {icon}
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </a>
  )
}
