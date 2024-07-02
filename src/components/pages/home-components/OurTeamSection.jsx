import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TeamCard = ({ imageSrc, name, role, additionalRole }) => {
  return (
    <div className="px-2">
      <div className="relative w-full bg-white rounded-lg border border-neutral/30 shadow-md h-full bg-transparent overflow-visible text-main hover:shadow-lg">
        {/* Card hold */}
        <div className="flex justify-center items-center mt-4">
          <img src="/icons/card-hold.svg" alt="Card Hold" className="opacity-50" />
        </div>
        <div className="relative mt-2">
          <img
            className="object-cover w-full h-96 md:h-[198px] 2xl:h-[260px]"
            src={imageSrc}
            alt={name}
          />
        </div>

        <div className="p-4 md:p-2.5">
          <h3 className="text-lg md:text-[15px] font-bold text-main mb-2 leading-5 md:min-h-10">{name}</h3>
          <p className="text-darkgray font-medium text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          width: "22px",
          height: "22px",
          cursor: "pointer",
          borderRadius: "50%",
        }}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          style={{ width: "100%", height: "100%", fill: "#00A8D0" }} // Adjust fill color as needed
        >
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          width: "22px",
          height: "22px",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          style={{
            width: "100%",
            height: "100%",
            fill: "#00A8D0",
            transform: "scaleX(-1)",
          }}
        >
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: false,    
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
    ],
  };

const OurTeamSection = () => {
  return (
    <div className="container text-main mb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between -mt-3">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
            viewBox="0 0 10 10"
            className="text-secondary"
          >
            <path fill="currentColor" d="M0 7h16v1H0z"></path>
          </svg>
          <span className="text-xl md:text-2xl font-bold text-main">
            Aviatick
          </span>
          <span className="text-xl md:text-2xl ml-2 font-bold text-primary">
            Team
          </span>
        </div>
      </div>
      <div className="mt-10">
        <Slider {...settings}>
          <TeamCard
            imageSrc="/team/abiyyi.png"
            name="Muhammad Faiq Al Abiyyi"
            role="Back-end Developer"
          />
          <TeamCard
            imageSrc="/team/rama.png"
            name="I Putu Rama Astra Arimbawa"
            role="Back-end Developer"
          />
          <TeamCard
            imageSrc="/team/rizki.png"
            name="Rizki Setyo Putro Robawa"
            role="Back-end Developer"
          />
          <TeamCard
            imageSrc="/team/adit.png"
            name="Aditya Herdiansyah Putra"
            role="Front-end Developer"
          />
          <TeamCard
            imageSrc="/team/amal.png"
            name="Amalia Rodhya Ulfa"
            role="Front-end Developer"
          />
          <TeamCard
            imageSrc="/team/talitha.png"
            name="Talitha Syafiyah"
            role="Front-end Developer"
          />
        </Slider>
      </div>
    </div>
  );
};

export default OurTeamSection;
