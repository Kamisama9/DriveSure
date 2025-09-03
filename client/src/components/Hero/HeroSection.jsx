import { useState } from "react";
import HeroBg from "../../assets/hero/hero-bg.png"

const HeroSection = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <>
      <div
        id="Hero"
        className="flex md:flex-row flex-col text-center
        md:text-start cont justify-center items-center mt-30"
      >
        <div className="flex flex-col gap-2 max-w-150">
          <h4 className="text-[1.5rem] font-semibold">Plan your trip now</h4>
          <h1 className="font-bold text-[3rem] md:text-[3.5rem] leading-15">
            Save with our car Services
          </h1>
          <form>
            <input
          type="text"
          placeholder="Enter location"
          className="w-full p-2 border text-white rounded-md mb-2 bg-transparent my-2"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter destination"
          className="w-full p-2 border text-white rounded-md bg-transparent my-2"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

            <button type="submit" className="secondary-btn mx-45 my-5" >
              Book a cab
            </button>
          </form>
          
        </div>

        <div className="hidden md:flex">
          <img
            src={HeroBg}
            className="absolute top-0 right-0 z-[-1] opacity-40"
          />
        </div>
      </div>
    </>
  );
}

export default HeroSection;
