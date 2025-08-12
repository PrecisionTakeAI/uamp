import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UAMP • Dispute Intake',
  description: 'UAMP on DALRN — Minimal UI to submit a dispute and view PoDP receipts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="font-semibold text-gray-900">UAMP on DALRN</span>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
