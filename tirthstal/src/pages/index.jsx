import Hero            from "../components/home/Hero";
import Stats           from "../components/home/Stats";
import BrowseByDeity   from "../components/home/BrowseByDeity";
import PopularTemples  from "../components/home/PopularTemples";
import DistrictExplore from "../components/home/DistrictExplore";

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <BrowseByDeity />
      <PopularTemples />
      <DistrictExplore />
    </div>
  );
}