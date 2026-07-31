/* BASSMENT — Home */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeHero } from "@/components/sections/home-hero";
import { FeaturedEvent } from "@/components/sections/featured-event";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { VenueTeaser } from "@/components/sections/venue-teaser";
import { ResidentDjs } from "@/components/sections/resident-djs";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export const revalidate = 3600

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <HomeHero />
      <ScrollReveal><FeaturedEvent /></ScrollReveal>
      <ScrollReveal><UpcomingEvents /></ScrollReveal>
      <ScrollReveal><VenueTeaser /></ScrollReveal>
      <ResidentDjs />
      <ScrollReveal><NewsletterSignup /></ScrollReveal>
      <Footer />
    </div>
  );
}
