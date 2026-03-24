import { motion } from "framer-motion";
import GoogleLogin from "../components/GoogleLogin";
import mascot from "../assets/mascot.png";

function LoginPage() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <motion.div
        className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <section className="order-2 flex justify-center lg:order-1 lg:justify-start">
          <div className="relative flex w-full max-w-[420px] items-center justify-center rounded-[2rem] bg-white/55 px-6 py-8 shadow-[0_20px_60px_rgba(76,47,110,0.12)] ring-1 ring-white/70 backdrop-blur-xl sm:max-w-[500px] sm:px-8 sm:py-10 lg:min-h-[520px]">
            <div className="absolute inset-x-6 bottom-6 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,153,102,0.16)_0%,rgba(255,94,98,0.08)_38%,transparent_72%)] blur-2xl sm:inset-x-10 sm:bottom-8" />

            <motion.img
              src={mascot}
              alt="Kickit mascot"
              className="relative z-10 h-auto w-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px]"
              animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 text-center lg:text-left">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-text)]">
                Welcome to Kickit
              </p>

              <h1 className="brand-font mt-2 text-4xl font-bold leading-tight text-[var(--heading-text)] sm:text-5xl">
                Kick goals
                <br className="hidden sm:block" /> together
              </h1>

              <p className="mt-3 text-sm leading-6 text-[var(--muted-text)] sm:text-base">
                Jump straight and start building bucket lists
                with your people.
              </p>
            </div>

            <div className="section-card p-6 sm:p-8">
              <GoogleLogin />
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

export default LoginPage;