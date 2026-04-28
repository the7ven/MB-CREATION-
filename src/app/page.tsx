import HeroSlider from "@/components/home/HeroSlider";
import BestSellers from "@/components/home/BestSellers"; 
import NewArrivals from "@/components/home/NewArrivals"; 
import SpecialOffers from "@/components/home/SpecialOffers"; 

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-white"> 
      <HeroSlider />
      <BestSellers />
      <NewArrivals />
      <SpecialOffers />
    </main>
  );
}