import { TooltipProvider } from "@/components";
import "@/styles/globals.css";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Crimson_Text } from "next/font/google";
import { useState } from "react";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-crimson",
});

function App({ Component, pageProps: { session, ...pageProps } }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <TooltipProvider>
            <div
              className={`relative min-h-screen text-stone-900 ${crimson.variable}`}
            >
              <Component {...pageProps} />
            </div>
          </TooltipProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
