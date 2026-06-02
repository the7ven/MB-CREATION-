"use client";

import HeroSlider from "@/components/home/HeroSlider";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import SpecialOffers from "@/components/home/SpecialOffers";


export const dynamic = 'force-dynamic'
export default function HomePage() {
  return (
    <div className="relative flex flex-col w-full bg-white min-h-screen overflow-x-hidden">
      <div id="hero">
        <HeroSlider />
      </div>
      <div id="featured-categories">
        <FeaturedCategories />
      </div>
      <div id="bestsellers">
        <BestSellers />
      </div>
      <div id="newarrivals">
        <NewArrivals />
      </div>
      <div id="specialoffers">
        <SpecialOffers />
      </div>
    </div>
  );
}
