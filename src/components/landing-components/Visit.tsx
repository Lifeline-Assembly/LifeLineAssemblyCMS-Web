import { VisitBgImage } from "../../assets/images"
import { QuoteImage } from "../../assets/svgs"
import OrangeButton from "../buttons/OrangeButton"

const Visit = () => {
  return (
    <div
      style={{ backgroundImage: `url(${VisitBgImage})` }}
      className="relative inset-0 bg-cover bg-center flex flex-col items-center justify-center w-full min-h-[500px] md:h-[700px]"
    >
      <div className="absolute bg-light-orange inset-0 opacity-30" />
      <div className="flex flex-col md:flex-row md:w-[90%] lg:w-[80%] xl:w-[55%] mx-auto z-20 bg-white px-6 sm:px-10 md:px-16 py-10 md:py-20 gap-8 md:gap-16 border-b-[12px] md:border-b-[16px] border-main-orange m-4 md:m-0">
        <div className="flex flex-col w-full md:w-[60%] gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">We want to serve the world around us</h1>
          <p className="text-sm sm:text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
          <div className="mt-2 md:mt-0">
            <OrangeButton text="Visit" onClick={() => { }} />
          </div>
        </div>
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <img 
            src={QuoteImage} 
            alt="Visit Image" 
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-auto md:h-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default Visit;