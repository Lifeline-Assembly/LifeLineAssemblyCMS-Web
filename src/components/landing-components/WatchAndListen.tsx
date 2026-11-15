import { Four, One, Three, Two } from "../../assets/images"
import { motion } from "framer-motion";

const items: { title: string, img: string, text?: string }[] = [
  {
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    img: One
  },
  {
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    img: Two
  },
  {
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    img: Three
  },
  {
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    img: Four
  },
]
const motionItem = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1, y: 0,
    transition: {
      duration: 0.6,
    }
  },
};
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};
const WatchAndListen = () => {
  return (
    <div className="bg-[#F5F2F0]">
      <section className="py-16 px-4 md:px-12 lg:px-20 text-center max-w-7xl mx-auto gap-8">
        <p className="uppercase text-sm text-main-black">Watch AND LISTEN</p>

        {/* Main headline */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-6">
          THE BENEFITS OF JOINING OUR CHURCH
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 mt-12">
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={motionItem}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="bg-white shadow-md overflow-hidden relative h-[370px]">
              <div
                style={{ backgroundImage: `url(${item.img})` }}
                className="w-full h-full object-cover absolute bg-cover bg-center "
              />
              <div className="p-4 absolute bottom-0 w-full bg-transparent text-white text-left bg-gradient-to-b from-[rgba(6,6,6,0.76)_16.68%] to-[rgba(0,0,0,0.02)_96.44%]">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                {item.text && <p className="text-gray-600">{item.text}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}

export default WatchAndListen