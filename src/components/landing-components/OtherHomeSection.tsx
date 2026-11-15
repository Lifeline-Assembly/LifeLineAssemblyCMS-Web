import React from "react";
import { FaHandsHelping, FaBroadcastTower, FaGift } from "react-icons/fa";
import { AppleStoreImage, GooglePlayImage } from "../../assets/svgs";

export const OtherHomeSection = () => {
  return (
    <div>OtherHomeSection</div>
  )
}


export const InfoSection: React.FC = () => {
  const cards = [
    {
      icon: <FaHandsHelping className="text-white text-xl" />,
      title: "ABOUT US",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      icon: <FaBroadcastTower className="text-white text-xl" />,
      title: "GET INVOLVED",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      icon: <FaGift className="text-white text-xl" />,
      title: "GIVING BACK",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];

  return (
    <section className="py-12 px-4 md:px-12 lg:px-20 text-center">
      {/* Subheadline */}
      <p className="uppercase text-sm text-gray-500">Sub-headline</p>

      {/* Main headline */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-10">
        A CHURCH THAT'S RELEVANT
      </h2>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group bg-light-orange px-12 py-16 shadow-sm flex flex-col items-start text-left relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Icon */}
            <div className="bg-main-orange w-12 h-12 flex items-center justify-center rounded-full mb-4">
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mb-3">{card.title}</h3>

            {/* Text */}
            <p className="text-sm text-gray-700">{card.text}</p>

            {/* Sliding orange bar */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-main-orange translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
          </div>
        ))}
      </div>
    </section>
  );
};


export const StayConnectedSection: React.FC = () => {
  return (
    <div className="w-full bg-white py-14 px-5 md:px-16">
      <div className="text-center mb-10">
        <p className="text-sm text-main-black uppercase tracking-widest">
          OUR MOBILE APPLICATION
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-main-black mt-2">
          STAY CONNECTED, <br /> DOWNLOAD OUR MOBILE APP
        </h2>
        <div className="flex sm:flex-row flex-col justify-center mt-8 gap-4">
          <img src={AppleStoreImage} alt="Apple store" />
          <img src={GooglePlayImage} alt="Google play" />
        </div>
      </div>
    </div>
  )
}

