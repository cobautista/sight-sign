'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { generateQRCodeImage } from '@/lib/utils/qr-code'
import type { Worker } from '@/lib/types/database'

export default function WorkerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [worker, setWorker] = useState<Worker | null>(null)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWorkerData()
  }, [])

  const loadWorkerData = async () => {
    try {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      // Load worker profile
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('id', user.id)
        .single()

      if (workerError) throw workerError
      if (!workerData) throw new Error('Worker profile not found')

      setWorker(workerData)

      // Generate QR code image
      const qrImage = await generateQRCodeImage(workerData.qr_code_hash)
      setQrCodeImage(qrImage)
    } catch (err: any) {
      console.error('Error loading worker data:', err)
      setError(err.message || 'Failed to load worker data')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const downloadQRCode = () => {
    if (!qrCodeImage || !worker) return

    const link = document.createElement('a')
    link.href = qrCodeImage
    link.download = `${worker.name.replace(/\s+/g, '-')}-QR-Code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
    )
  }

  if (error || !worker) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="text-red-600 mb-4 text-center">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-semibold">Error</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {worker.name}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your QR Code
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Show this QR code to site admins when signing in
            </p>

            {qrCodeImage ? (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border-2 border-gray-300 flex justify-center">
                  <img
                    src={qrCodeImage}
                    alt="Worker QR Code"
                    className="w-64 h-64"
                  />
                </div>

                <button
                  onClick={downloadQRCode}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download QR Code
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Save this to your phone for quick access
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Failed to generate QR code
              </div>
            )}
          </div>

          {/* Worker Info Section */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 mt-1">{worker.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-gray-900 mt-1">{worker.company}</p>
              </div>

              {worker.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 mt-1">{worker.phone}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Member Since
                </label>
                <p className="text-gray-900 mt-1">
                  {new Date(worker.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                How to Use Your QR Code
              </h3>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Download and save the QR code to your phone</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Show it to the site admin when you arrive</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Complete the safety quiz if prompted</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">4.</span>
                  <span>You'll be automatically signed out at 6 PM</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Sign-In History (Phase 2 feature) */}
        <div className="mt-6 bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Sign-Ins
          </h2>
          <div className="text-center py-8 text-gray-500">
            <p>Sign-in history coming soon...</p>
            <p className="text-sm mt-2">Track your site visits and safety quiz scores</p>
          </div>
        </div>
      </div>
    </main>
  )
}
