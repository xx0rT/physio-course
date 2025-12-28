import { useEffect, useState } from "react";

export function useMediaQuery() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSm, setIsSm] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const smQuery = window.matchMedia("(max-width: 768px)");
    const tabletQuery = window.matchMedia("(max-width: 1024px)");

    setIsMobile(mobileQuery.matches);
    setIsSm(smQuery.matches);
    setIsTablet(tabletQuery.matches);

    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleSmChange = (e: MediaQueryListEvent) => setIsSm(e.matches);
    const handleTabletChange = (e: MediaQueryListEvent) => setIsTablet(e.matches);

    mobileQuery.addEventListener("change", handleMobileChange);
    smQuery.addEventListener("change", handleSmChange);
    tabletQuery.addEventListener("change", handleTabletChange);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
      smQuery.removeEventListener("change", handleSmChange);
      tabletQuery.removeEventListener("change", handleTabletChange);
    };
  }, []);

  return { isMobile, isSm, isTablet };
}
