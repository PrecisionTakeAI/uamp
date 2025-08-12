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
        <div className="max-w-4xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
