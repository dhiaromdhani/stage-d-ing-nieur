import HeroSlider from "../components/Hero/HeroSlider";
import Announcement from "../components/Announcement/Announcement";
import Services from "../components/Services/Services";
import CertificationsSection from "../components/CertificationsSection/CertificationsSection";
import StatsSection from "../components/StatsSection/StatsSection";

function Home() {
  return (
    <>
      <HeroSlider />
      <Announcement />
      <Services />
      <CertificationsSection />
      <StatsSection />
    </>
  );
}

export default Home;