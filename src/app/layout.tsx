import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Sistema de Vendas | Gestão Comercial",
  description: "Sistema completo de gestão comercial com vendas, estoque e clientes",
  keywords: ["vendas", "gestão", "comercial", "PDV", "estoque"],
  authors: [{ name: "Sistema de Vendas" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} antialiased h-full bg-gray-50`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'backdrop-blur-sm',
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1f2937',
              border: '1px solid rgba(209, 213, 219, 0.5)',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
