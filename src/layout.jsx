import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer";

export default function Layout() {
  return (
    <div className="main-background px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <motion.div
        className="mx-auto min-h-[calc(100vh-2rem)] max-w-[1400px] app-shell"
        initial={{ opacity: 0, y: 12, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <NavBar />

        <motion.main
          className="px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <Outlet />
        </motion.main>
        <Footer />
      </motion.div>
    </div>
  );
}