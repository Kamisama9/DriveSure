import { FaGithub } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';


const Footer = () => {
  return (
    <>
      <div className="bg-[#00000024] pt-15 pb-10">
        <div className="cont ">
          <div className="grid gap-10 grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col justify-center items-start gap-3">
              <h1 className="flex flex-col">
                © 2025 Made By
                <a
                  target="blank"
                  className="secondary-text font-semibold"
                >
                  Pratyush
                </a>
              </h1>
            </div>

            <div>
              <h1 className="font-bold Normal pb-3">ABOUT</h1>

              <div className="flex flex-col gap-2">
                <a href="/about" className="primary-text">
                  about us
                </a>
                <a href="/contact" className="primary-text">
                  contact us
                </a>
              </div>
            </div>

            <div>
              <h1 className="font-bold Normal pb-3">FOLLOW US</h1>

              <div className="flex flex-col gap-2">
                <a
                  target="blank"
                  className="primary-text flex gap-2 items-center"
                >
                  <FaGithub /> Github
                </a>
                <a
                  target="blank"
                  className="primary-text flex gap-2 items-center"
                >
                  <AiFillInstagram /> Instagram
                </a>
              </div>
            </div>

            <div>
              <h1 className="font-bold Normal pb-3">LEGAL</h1>

              <div className="flex flex-col gap-2">
                <a className="primary-text">Privacy Policy</a>
                <a className="primary-text">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
