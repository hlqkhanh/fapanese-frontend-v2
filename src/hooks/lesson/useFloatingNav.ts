import { useState, useEffect, type RefObject } from "react";

export const useFloatingNav = (navRef: RefObject<HTMLDivElement | null>) => {
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const navTop = navRef.current.getBoundingClientRect().top;
        setShowFloatingNav(navTop < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navRef]);

  return { showFloatingNav };
};
