import {
  AboutHeaderImage,
  FirstPrayer,
  SecondPrayer,
  ThirdPrayer,
  BenefitsOne,
  BenefitsTwo,
  BenefitsThree,
  BenefitsFour,
  TeamOne,
  TeamTwo,
  TeamThree,
  TeamFour,
} from "../../assets/images"

import RegularHeading from "../../components/landing-components/RegularHeading"
import { motion } from "framer-motion"
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"

const BenefitBlock = ({
  title,
  text,
  img,
  reverse,
}: {
  title: string
  text: string
  img: string
  reverse?: boolean
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } items-center gap-10 my-12 px-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }} // mobile: vertical
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="md:w-1/2 w-full"
      >
        <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
        <p className="mt-4 text-gray-600 text-sm sm:text-base">{text}</p>
      </motion.div>
      <motion.img
        src={img}
        alt={title}
        initial={{ opacity: 0, y: 50 }} // mobile: vertical
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="md:w-1/2 w-full rounded-lg object-cover"
      />
    </div>
  )
}

const TeamMember = ({
  img,
  name,
  role,
}: {
  img: string
  name: string
  role: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-gray-50 p-6 rounded-lg shadow text-center w-full max-w-xs"
  >
    <img
      src={img}
      alt={name}
      className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full object-cover"
    />
    <h3 className="mt-4 font-bold text-lg">{name}</h3>
    <p className="text-sm text-gray-500">{role}</p>
    <div className="flex justify-center gap-4 mt-4 text-gray-600">
      <a href="#"><FaFacebookF /></a>
      <a href="#"><FaTwitter /></a>
      <a href="#"><FaLinkedinIn /></a>
    </div>
  </motion.div>
)

const AboutUsPage = () => {
  const prayers = [
    { src: FirstPrayer, alt: "first-prayer", delay: 0 },
    { src: SecondPrayer, alt: "second-prayer", delay: 0.2 },
    { src: ThirdPrayer, alt: "third-prayer", delay: 0.4 },
  ]

  const infoBlocks = [
    {
      subtitle: "OUR MISSION & VISION",
      title: "STRIVING FOR A BETTER TOMORROW",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    },
    {
      subtitle: "WHAT WE DO",
      title: "BRINGING PEACE AND JOY TO THE WORLD",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    },
  ]

  const benefits = [
    {
      title: "FIND FULFILLMENT AND JOY",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      img: BenefitsOne,
    },
    {
      title: "SHARED VALUES",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      img: BenefitsTwo,
      reverse: true,
    },
    {
      title: "CHARITY EVENTS",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      img: BenefitsThree,
    },
    {
      title: "ALL ARE WELCOME",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      img: BenefitsFour,
      reverse: true,
    },
  ]

  const team = [
    { img: TeamOne, name: "KIM BOWEN", role: "Pastor, Church" },
    { img: TeamTwo, name: "DANIELLE WATKINS", role: "Pastor, Church" },
    { img: TeamThree, name: "NAOMI CRAIG", role: "Pastor, Church" },
    { img: TeamFour, name: "SANTOS PAYNE", role: "Pastor, Church" },
  ]

  return (
    <div>
      <RegularHeading
        title="About us"
        text="Serving the world around us"
        imgSrc={AboutHeaderImage}
      />

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto my-16 text-center px-4"
      >
        <h3 className="text-base sm:text-lg">WELCOME TO OUR CHURCH</h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4">LOVE AND COMPASSION</h2>
        <p className="mt-5 text-gray-600 text-sm sm:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ staggerChildren: 0.3 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10 px-4"
      >
        {prayers.map(({ src, alt, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className={`rounded-2xl overflow-hidden w-full sm:flex-1 max-w-[300px]
              ${i === 1 ? "h-[380px] sm:h-[420px]" : "h-[300px] sm:h-[350px]"}`}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-wrap justify-center gap-12 mt-16 px-4">
        {infoBlocks.map(({ subtitle, title, text }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }} // vertical only
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full sm:w-80 max-w-sm"
          >
            <h5 className="text-xs sm:text-sm text-gray-500">{subtitle}</h5>
            <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">{text}</p>
          </motion.div>
        ))}
      </div>

      <section className="max-w-5xl mx-auto mt-20 px-4">
        <h5 className="text-center text-sm text-gray-500">BENEFITS</h5>
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
          THE BENEFITS OF JOINING OUR CHURCH
        </h2>
        <div className="mt-12">
          {benefits.map((benefit, i) => (
            <BenefitBlock key={i} {...benefit} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto my-20 px-4">
        <h5 className="text-center text-sm text-gray-500">CHURCH MEMBERS</h5>
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
          MEET OUR INSPIRATIONAL TEAM
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 place-items-center">
          {team.map((member, i) => (
            <TeamMember key={i} {...member} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutUsPage
