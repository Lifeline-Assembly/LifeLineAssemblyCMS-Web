import HomeHeading from "../../components/landing-components/HomeHeading"
import LoveAndCompassion from "../../components/landing-components/LoveAndCompassion"
import MiniBlog from "../../components/landing-components/MiniBlog"
import { InfoSection, StayConnectedSection } from "../../components/landing-components/OtherHomeSection"
import UpcomingSermon from "../../components/landing-components/UpcomingSermon"
import Visit from "../../components/landing-components/Visit"
import WatchAndListen from "../../components/landing-components/WatchAndListen"

const HomePage = () => {
  return (
    <div>
      <HomeHeading />
      <InfoSection />
      <LoveAndCompassion />
      <WatchAndListen />
      <UpcomingSermon />
      <Visit />
      <MiniBlog />
      <StayConnectedSection />
    </div>
  )
}

export default HomePage