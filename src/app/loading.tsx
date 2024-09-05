// export default function Loading() {
//   return (
//     <main className="relative flex h-screen w-screen flex-col bg-gray-1">
//       <header className="flex items-center justify-between border-b border-b-gray-6 bg-gray-2 px-4 py-2 text-gray-12 md:px-8 md:py-4">
//         <h1 className="font-serif text-4xl">FAQMaker</h1>
//       </header>
//       <section className="mx-auto my-12 w-11/12">
//         <ul className="mx-auto flex w-11/12 list-none flex-col gap-4">
//           <li className="h-28 w-full animate-pulse rounded-md bg-gray-3 shadow-gray-9">
//             <div className="" />
//           </li>
//           <li className="h-28 w-full animate-pulse rounded-md bg-gray-3 shadow-gray-9" />
//           <li className="h-28 w-full animate-pulse rounded-md bg-gray-3 shadow-gray-9" />
//           <li className="h-28 w-full animate-pulse rounded-md bg-gray-3 shadow-gray-9" />
//           <li className="h-28 w-full animate-pulse rounded-md bg-gray-3 shadow-gray-9" />
//         </ul>
//       </section>
//       <footer className="absolute inset-x-0 bottom-0 flex w-full items-center justify-between border-t border-t-gray-6 bg-gray-2 px-8 py-2 text-xs text-gray-12">
//         <p className="text-sm font-bold">FAQMaker</p>
//       </footer>
//     </main>
//   );
// }

import { Loader } from '@/components';

export default function Loading() {
  return <Loader size="screen" />;
}
