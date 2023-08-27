import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";
import { Footer, Header } from "@/modules";
import { Crimson_Text } from "next/font/google";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-crimson",
});

function App({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <main
        className={`min-h-screen bg-stone-200 text-stone-900 ${crimson.variable}`}
      >
        <Header />
        <div className="my-12">
          <Component {...pageProps} />
        </div>
        <Footer />
      </main>
    </QueryClientProvider>
  );
}

export default App;
