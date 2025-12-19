import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShareButton from "@/components/shareButton";

const instructors = [
  {
    id: 1,
    name: "John Doe",
    position: "Senior Instructor",
    image: "/home/instructor1.png",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Lead Trainer",
    image: "/home/instructor2.png",
  },
  {
    id: 3,
    name: "Michael Johnson",
    position: "Expert Coach",
    image: "/home/instructor3.png",
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "Head of Training",
    image: "/home/instructor4.png",
  },
];

const InstructorsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleNavigate = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/instructors/${id}`);
  };

  return (
    <section className="max-w-7xl mx-auto relative my-15 px-5 md:px-10 py-32">
      <h1 className="text-neutral-800 dark:text-white text-center mb-10">
        {t("instructorsPage.title")}
      </h1>

      <Slider {...settings} className="instructor-slider">
        {instructors.map((instructor, index) => (
          <div key={index} className="px-4">
            <div className="relative">
              <img
                src={instructor.image}
                alt={instructor.name}
                className="relative w-full rounded-lg border-4 border-purple-500 cursor-pointer"
                onClick={() => handleNavigate(instructor.name)}
              />

              <div className="absolute top-15 right-10">
              <ShareButton />
              </div>

              <div
                className="absolute -bottom-1 left-2/4 transform -translate-x-2/4 bg-white  dark:bg-neutral-700 rounded-lg p-2 md:p-1 z-10 text-left shadow-lg cursor-pointer"
                onClick={() => handleNavigate(instructor.name)}
              >
                <h2 className="text-base md:text-sm  dark:text-white">{instructor.name}</h2>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-purple-500 dark:text-purple-500">{instructor.position}</p>
                  <FaArrowRight className="bg-gray-100 text-purple-500 text-xs md:text-sm rounded-full p-[3px]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default InstructorsPage;
