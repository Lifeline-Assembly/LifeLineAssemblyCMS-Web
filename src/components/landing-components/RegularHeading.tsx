import React from 'react';
import { AboutHeaderImage } from '../../assets/images';

interface RegularHeadingProps {
  imgSrc?: string;
  title?: string;
  text: string;
  diff?: boolean;
}

const RegularHeading: React.FC<RegularHeadingProps> = ({ text, imgSrc, title, diff }) => {
  return (
    <div className="relative h-[419px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imgSrc || AboutHeaderImage})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex flex-col justify-center md:px-32 px-6 h-full my-auto text-white">
        <div>
          {title && (
            <h4
              className={`text-base font-bold ${
                diff ? 'text-main-orange' : 'text-white/80'
              }`}
            >
              {title}
            </h4>
          )}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl leading-tight font-bold ${
              diff ? 'text-white' : 'text-white'
            }`}
          >
            {text}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default RegularHeading;
