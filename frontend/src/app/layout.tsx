import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مَجْلِس الذكي | Majles-AI — المنظومة المؤسسية لإدارة وتلخيص الاجتماعات بالذكاء الاصطناعي',
  description: 'نظام مؤسسي متكامل لتفريغ وتسجيل الاجتماعات الصوتية، واستخراج التلخيص التنفيذي والقرارات والتوصيات، والبحث التفاعلي RAG باللغة العربية الفصحى واللهجات.',
  keywords: ['تلخيص اجتماعات', 'تفريغ صوتي عربي', 'ذكاء اصطناعي محلي', 'RAG اجتماعات', 'WhisperX', 'Qwen 2.5', 'مساعد اجتماعات'],
  authors: [{ name: 'Mohammed AL-Haj' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
