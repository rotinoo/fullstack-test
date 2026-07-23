import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BarangListPage } from './pages/BarangListPage';
import { BarangFormPage } from './pages/BarangFormPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4">
              <span className="rounded-md bg-blue-600 px-2 py-1 text-sm font-bold text-white">
                MP
              </span>
              <h1 className="text-lg font-semibold text-slate-800">
                Master Barang
              </h1>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/master/barang" replace />} />
              <Route path="/master/barang" element={<BarangListPage />} />
              <Route path="/master/barang/tambah" element={<BarangFormPage />} />
              <Route path="/master/barang/:id/ubah" element={<BarangFormPage />} />
              <Route
                path="*"
                element={
                  <div className="rounded-lg bg-white p-8 text-center text-slate-500 shadow-sm">
                    Halaman tidak ditemukan.
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}
