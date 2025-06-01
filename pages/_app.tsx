// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
import { useEffect } from "react";

// Inside your main component, add a useEffect to initialize on the client side
export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TEMPO) {
      TempoDevtools.init();
    }
  }, []);

  return <Component {...pageProps} />;
}
