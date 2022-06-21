import Link from "next/link";
import React, { useEffect, useState } from "react";

function Header() {
  const [dropDown, setDropDown] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.querySelector('.menu-btn-wrapper').addEventListener('click', (e) => {
      document.querySelector('.menu-btn').classList.add('clicked')
    })

    if (dropDown && !loaded) setLoaded(true);
    
  }, [dropDown]);

  const handleDropDown = () => {
    if (!dropDown) {
      document.body.style.height = "100vh"
      document.body.style.width = "100%";
    } else {
      document.querySelector('.menu-btn').classList.remove('clicked')
    }

    setDropDown(!dropDown);
  };

  return (
    <>
      <div className="navbar absolute w-full h-[80px] lg:h-[140px] flex justify-center z-50">
        <nav
          className={`absolute z-10 wrapper max-w-bg w-full h-[80px] lg:h-[140px] flex justify-between items-center bg-gray-500 mx-auto`}
        >
          <div className="logo-wrapper px-10 nav-item hidden lg:flex z-10">
            <Link href="/">
              <a href="/">
                <img
                  className="px-2 h-7 lg:h-10 cursor-pointer"
                  src="/images/"
                  alt="logo image"
                />
              </a>
            </Link>
          </div>

          <div className="home-wrapper lg:absolute lg:w-full px-10 flex justify-center">
            <Link href="/">
              <a title="home" className="uppercase text-7xl text-black font-extrabold">
                TEXT LOGO
              </a>
            </Link>
          </div>

          <div className="right-header-wrapper flex items-center nav-item px-10 z-10">
            <div className="menu-btn-wrapper flex items-center" onClick={handleDropDown}>
              <div className="uppercase text-black text-2xl lg:text-3xl hidden sm:block tracking-[0.07rem]"></div>
              <div className="menu-btn w-[40px] sm:w-[50px] flex flex-col cursor-pointer">
                <span className="line1 w-1/2"></span>
                <span className="line2 w-full"></span>
                <span className="line3 w-9/12"></span>
              </div>
            </div>
          </div>
          {loaded && (
            <div
              className={`dropdown-wrapper ${
                dropDown ? "animate-open" : "animate-close"
              } fixed h-[calc(100vh-80px)] lg:h-[calc(100vh-140px)] w-full top-[80px] lg:top-[140px] flex justify-end hd:right-[calc((100vw-1937px)/2)]`}
            >
              <div
                className="dropdown-overlay w-0 lg:w-7/12"
                onClick={handleDropDown}
              ></div>
              <ul
                className={
                  "bg-gray-500 bg-cover flex flex-col justify-evenly text-right px-20 py-10 overflow-hidden h-full w-full lg:w-[56%] xl:w-5/12"
                }
              >
                <li className="text-green-400 text-xl xs:text-2xl lg:text-3xl pb-10 uppercase tracking-[.2rem]">
                  Menu
                </li>
                <li className="uppercase tracking-[.2rem]">
                  <Link href="/">
                    <a
                      className="text-green-400 hover:text-red-700 text-2xl xs:text-3xl lg:text-4xl"
                      onClick={handleDropDown}
                    >
                      Home
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

export default Header;
