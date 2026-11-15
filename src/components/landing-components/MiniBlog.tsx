import { motion } from 'framer-motion';

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

interface postPropType {
  type: string;
  title?: string;
  text: string;
  date?: string;
  user?: string;
}
const items: postPropType[] = [
  {
    type: 'Relationship',
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    user: 'Mathew Johnson',
    date: 'Tuesday 13 May, 2021',
  },
  {
    type: 'Relationship',
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    user: 'Mathew Johnson',
    date: 'Tuesday 13 May, 2021',
  },
  {
    type: 'Relationship',
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    user: 'Mathew Johnson',
    date: 'Tuesday 13 May, 2021',
  },
  {
    type: 'Relationship',
    title: 'WATCH AND LISTEN TO OUR SERMONS',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    user: 'Mathew Johnson',
    date: 'Tuesday 13 May, 2021',
  }
];
const MiniBlog = () => {
  return (
    <div className="w-full bg-white py-14 px-5 md:px-16">
      <div className="text-center mb-10">
        <p className="text-sm text-main-black uppercase tracking-widest">
          Read our Blog
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-main-black mt-2">
          SHARE, INSPIRE, INNOVATE
        </h2>
      </div>
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
            className="group bg-light-orange px-10 py-16 gap-4 shadow-sm flex flex-col items-start text-left relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          >
            <p
              style={{ backgroundClip: "text", WebkitTextFillColor: "transparent" }}
              className="text-xs bg-gradient-to-r from-[#A54E2B] to-[#DC9853] font-bold uppercase"
            >{item.type}</p>
            <h2 className='text-2xl font-bold'>{item.title}</h2>
            <p>{item.text}</p>
            <div className='mt-2'>
              <p className='text-lg'>By {item.user}</p>
              <p>{item.date}</p>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-2 bg-main-orange translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default MiniBlog