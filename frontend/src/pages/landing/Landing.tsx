import './landing.css';
import { Hero } from './sections/Hero';
import { Footer } from './sections/Footer';
import { SupabaseSection } from './sections/SupabaseSection';
import { TelegramSection } from './sections/TelegramSection';
import { FlowSection } from './sections/FlowSection';

export default function Landing() {
  return (
    <div className="lp-root">
      <div className="lp-grain" aria-hidden />

      <Hero />

      <main className="lp-slides">
        <SupabaseSection />
        <TelegramSection />
        <FlowSection />
      </main>

      <Footer />
    </div>
  );
}
