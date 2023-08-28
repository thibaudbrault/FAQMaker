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
          <main
            className={`min-h-screen bg-stone-200 text-stone-900 ${crimson.variable}`}
          >
            <Component {...pageProps} />
          </main>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
