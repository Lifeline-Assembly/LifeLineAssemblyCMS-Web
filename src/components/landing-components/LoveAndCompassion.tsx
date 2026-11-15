"use client";

import React from "react";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { FirstPrayer, SecondPrayer, ThirdPrayer } from "../../assets/images";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1, y: 0,
    transition: {
      duration: 0.6,
    }
  },
};

const LoveAndCompassion: React.FC = () => {
  const images = [
    FirstPrayer,
    SecondPrayer,
    ThirdPrayer
  ];

  return (
    <section className="py-16 px-4 md:px-12 lg:px-20 text-center max-w-7xl mx-auto">
      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="uppercase text-sm text-main-black">Sub-headline</motion.p>

      {/* Main headline */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-6">
        LOVE AND COMPASSION
      </motion.h2>

      {/* Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-gray-600 max-w-2xl mx-auto mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </motion.p>

      {/* Read More Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-md mb-12"
      >
        READ MORE
      </motion.button>

      {/* Images */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {images.map((src, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className={`overflow-hidden rounded-2xl shadow-md ${idx === 1 ? "md:mt-16 md:-mb-16" : ""}`}
          >
            <img
              src={src}
              loading="lazy"
              alt={`image-${idx}`}
              className="w-full h-[300px] object-cover"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl mx-auto">
        <p className="uppercase text-xs text-gray-500 tracking-wide mb-2">
          Our Mission & Vision
        </p>
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          CELEBRATE WITH US
        </h3>
        <p className="text-gray-600 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <motion.a
          href="#"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-800 hover:text-orange-500"
        >
          Read More <BsArrowRight className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default LoveAndCompassion;
