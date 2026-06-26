import type { Metadata } from "next";
import { 
  Playfair_Display, 
  Montserrat, 
  Pattaya,
  Cormorant_Garamond,
  Yeseva_One,
  Merriweather,
  PT_Serif,
  Lora,
  Roboto_Slab,
  Comfortaa,
  EB_Garamond
} from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-playfair" });
const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-montserrat" });
const pattaya = Pattaya({ weight: "400", subsets: ["latin", "cyrillic"], variable: "--font-pattaya" });
const scriptFont = Pattaya({ weight: "400", subsets: ["latin", "cyrillic"], variable: "--font-script" });
const cormorant = Cormorant_Garamond({ weight: ["400", "600"], subsets: ["latin", "cyrillic"], variable: "--font-cormorant" });
const yeseva = Yeseva_One({ weight: "400", subsets: ["latin", "cyrillic"], variable: "--font-yeseva" });
const merriweather = Merriweather({ weight: ["300", "400", "700"], subsets: ["latin", "cyrillic"], variable: "--font-merriweather" });
const ptSerif = PT_Serif({ weight: ["400", "700"], subsets: ["latin", "cyrillic"], variable: "--font-ptserif" });
const lora = Lora({ subsets: ["latin", "cyrillic"], variable: "--font-lora" });
const robotoSlab = Roboto_Slab({ subsets: ["latin", "cyrillic"], variable: "--font-robotoslab" });
const comfortaa = Comfortaa({ subsets: ["latin", "cyrillic"], variable: "--font-comfortaa" });
const ebGaramond = EB_Garamond({ subsets: ["latin", "cyrillic"], variable: "--font-ebgaramond" });

const fontVariables = `${playfair.variable} ${montserrat.variable} ${pattaya.variable} ${scriptFont.variable} ${cormorant.variable} ${yeseva.variable} ${merriweather.variable} ${ptSerif.variable} ${lora.variable} ${robotoSlab.variable} ${comfortaa.variable} ${ebGaramond.variable}`;

export const metadata: Metadata = {
  title: "Свадебное Приглашение | Wedding Invite",
  description: "Мы приглашаем вас разделить этот особенный день с нами.",
};

import db from "@/lib/db";
import { LanguageProvider } from "@/hooks/useLanguage";
import { GuestProvider } from "@/hooks/useGuest";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mainBgSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('main_bg') as { value: string } | undefined;
  const paperTexture = db.prepare('SELECT value FROM settings WHERE key = ?').get('paper_texture') as { value: string } | undefined;
  
  const bgImage = mainBgSetting?.value || paperTexture?.value || '/images/paper-texture.png';

  const themeSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('site_theme') as { value: string } | undefined;
  const themeClass = themeSetting?.value || 'theme-sage';

  const headingFontSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('heading_font') as { value: string } | undefined;
  const headingFont = headingFontSetting?.value || 'Playfair_Display';

  const fontMap: Record<string, string> = {
    'Playfair_Display': 'var(--font-playfair)',
    'Montserrat': 'var(--font-montserrat)',
    'Pattaya': 'var(--font-pattaya)',
    'Cormorant_Garamond': 'var(--font-cormorant)',
    'Yeseva_One': 'var(--font-yeseva)',
    'Merriweather': 'var(--font-merriweather)',
    'PT_Serif': 'var(--font-ptserif)',
    'Lora': 'var(--font-lora)',
    'Roboto_Slab': 'var(--font-robotoslab)',
    'Comfortaa': 'var(--font-comfortaa)',
    'EB_Garamond': 'var(--font-ebgaramond)',
    'Custom': "'CustomAdminFont', serif"
  };
  const headingCssVar = fontMap[headingFont] || 'var(--font-playfair)';

  const customHeadingFontUrlSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('custom_heading_font_url') as { value: string } | undefined;
  const customFontUrl = customHeadingFontUrlSetting?.value || '';

  const isCustomFont = headingFont === 'Custom' && customFontUrl;

  return (
    <html lang="tk" className={fontVariables}>
      <body suppressHydrationWarning className={`min-h-screen bg-wedding-background font-sans antialiased relative ${themeClass}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          ${isCustomFont ? `
            @font-face {
              font-family: 'CustomAdminFont';
              src: url('${customFontUrl}');
              font-display: swap;
            }
          ` : ''}
          :root {
            --font-heading: ${headingCssVar};
          }
          body::before {
            content: "";
            position: fixed;
            inset: 0;
            background-image: url('${bgImage}');
            background-size: cover;
            opacity: 0.4;
            pointer-events: none;
            z-index: -1;
          }
        `}} />
        <LanguageProvider>
          <GuestProvider>
            {children}
          </GuestProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

