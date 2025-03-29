import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import EventsSection from '@/components/home/EventsSection';
import CtaSection from '@/components/home/CtaSection';
import ClubDescription from '@/components/home/ClubDescription';
import PhotoGallery from '@/components/home/PhotoGallery';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ClubDescription />
      <AboutSection />
      <EventsSection />
      <PhotoGallery />
      <CtaSection />
    </main>
  );
}
