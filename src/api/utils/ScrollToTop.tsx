import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Get the current URL path
  const { pathname } = useLocation();

  // This effect runs every time the pathname changes
  useEffect(() => {
    // Scroll the window to the top left corner (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array: only re-run if pathname changes

  // This component doesn't render any HTML
  return null;
};

export default ScrollToTop;