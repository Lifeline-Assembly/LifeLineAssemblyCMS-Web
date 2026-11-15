import { useNavigate } from "react-router-dom";
import { HomeBgImage } from "../../assets/images";
import OrangeButton from "../buttons/OrangeButton";

const HomeHeading = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-[660px] overflow-hidden">
      <div
        style={{ backgroundImage: `url(${HomeBgImage})` }}
        className="absolute inset-0 bg-cover bg-center scale-x-[-1] "
      />
      <div className="relative flex flex-col justify-between xl:w-1/2 md:px-32 px-6 py-32 gap-8">
        <h4 className="text-base font-bold text-white">Welcome to LIFELINE ASSEMBLY</h4>
        <h1 className="text-[64px] leading-20 font-bold text-white">Become a part of our community</h1>
        <div className="flex sm:flex-row flex-col gap-6">
          <button
            className="border border-main-orange py-6 px-16 rounded-xl text-white font-semibold hover:bg-white hover:text-black transition-all"
            onClick={() => navigate('login')}
          >
            Login
          </button>
          <OrangeButton text="Register" onClick={() =>navigate('register')} />
        </div>
      </div>
    </div>
  )
}

export default HomeHeading;