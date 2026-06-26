import db from "@/lib/db";
import Hero from "@/components/sections/Hero";
import LoveStory from "@/components/sections/LoveStory";
import Timing from "@/components/sections/Timing";
import Map from "@/components/sections/Map";
import LiveGallery from "@/components/sections/LiveGallery";
import RSVPForm from "@/components/sections/RSVPForm";
import Envelope from "@/components/Envelope";
import Footer from "@/components/sections/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  const settingsRows = db.prepare('SELECT * FROM settings').all() as { key: string, value: string }[];
  const settings = settingsRows.reduce((acc: any, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return (
    <Envelope settings={settings}>
      <main>
        <Hero settings={settings} />
        <LoveStory settings={settings} />
        <Timing settings={settings} />
        <Map settings={settings} />
        <LiveGallery />
        <RSVPForm settings={settings} />
        
        <Footer settings={settings} />
      </main>
    </Envelope>
  );
}


