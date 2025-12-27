import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Sight-Sign
        </h1>
        <p className="text-xl text-gray-600">
          Construction Site Safety Induction System
        </p>
        <p className="text-gray-500">
          QR code-based digital sign-in for construction workers
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Register as Worker
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Admin Login
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">QR Code Sign-In</h3>
            <p className="text-sm text-gray-600">
              Workers receive unique QR codes for instant site access
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-gray-900 mb-2">Safety Quiz</h3>
            <p className="text-sm text-gray-600">
              Interactive OSHA-based quiz ensures safety compliance
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-Time Dashboard</h3>
            <p className="text-sm text-gray-600">
              Site managers see live updates of who's on-site
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
