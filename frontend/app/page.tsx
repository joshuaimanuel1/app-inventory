import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-white">
        Welcome to Inventory App
      </h1>
      <p className="text-xl text-gray-400 mb-8">Manage items</p>
      <Link
        href="/inventories"
        className="px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md text-sm hover:from-blue-600 hover:to-indigo-700 transition duration-200 ease-in-out shadow-md"
      >
        Get Started
      </Link>
    </div>
  );
}

// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
//       <h1 className="text-5xl font-bold mb-4 text-white">
//         Welcome to Inventory App
//       </h1>
//       <p className="text-xl text-gray-400 mb-8">
//         Manage your items efficiently and easily.
//       </p>

//       {/* Tombol untuk langsung ke halaman login atau inventory */}
//       <Link
//         href="/inventories"
//         className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
//       >
//         Get Started
//       </Link>
//     </div>
//   );
// }
