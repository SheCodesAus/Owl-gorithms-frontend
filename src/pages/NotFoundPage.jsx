import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import lostBucket from "/lost.png";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(122,84,199,0.22),_transparent_26%),linear-gradient(180deg,#2a0d54_0%,#1b083a_58%,#15072f_100%)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-[#ff8f8f]/20 blur-3xl" />
        <div className="absolute right-[-5rem] top-[10%] h-80 w-80 rounded-full bg-[#8c61ff]/20 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-[20%] h-72 w-72 rounded-full bg-[#ffb085]/15 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              wrong turn, huh?
            </p>

            <h1 className="max-w-[9ch] text-6xl font-bold leading-[0.9] tracking-[-0.05em] text-[#fff8fb] sm:text-7xl md:text-8xl">
              404
              <span className="block bg-gradient-to-r from-[#ffb085] via-[#ff8f8f] to-[#ffd0df] bg-clip-text text-transparent">
                looks like this dream got lost.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
              The page you were looking for has wandered off the path. Let’s get
              you back to somewhere a little less tragic.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex min-h-[3.7rem] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff8c78] via-[#ff6f86] to-[#8c61ff] px-6 py-4 text-base font-extrabold text-white shadow-[0_18px_36px_rgba(73,32,136,0.34)] transition hover:-translate-y-0.5"
              >
                Take me home
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex min-h-[3.7rem] items-center justify-center rounded-2xl border border-white/14 bg-white/8 px-6 py-4 text-base font-bold text-white/92 backdrop-blur-md transition hover:bg-white/12"
              >
                Go to dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="relative z-10 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[620px]">
              <div className="absolute inset-[8%] rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(255,160,135,0.24),transparent_42%),radial-gradient(circle_at_55%_40%,rgba(194,146,255,0.2),transparent_48%)] blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.17),rgba(255,255,255,0.04))] p-3 shadow-[0_40px_80px_rgba(7,4,19,0.45)] backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <img
                    src={lostBucket}
                    alt="A sad Kickit bucket character standing lost in a misty forest"
                    className="block h-auto w-full object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(91,53,176,0.08),rgba(255,140,120,0.06))] mix-blend-multiply" />
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(24,8,52,0.18)]" />
                </div>

                <div className="absolute right-4 top-4 rounded-2xl border border-white/14 bg-[rgba(91,53,176,0.30)] px-4 py-3 text-sm font-extrabold text-white/95 shadow-[0_16px_40px_rgba(8,5,20,0.24)] backdrop-blur-xl">
                  Definitely not this way
                </div>

                <div className="absolute bottom-4 left-4 rounded-2xl border border-white/14 bg-[rgba(91,53,176,0.30)] px-4 py-3 text-sm font-extrabold text-white/95 shadow-[0_16px_40px_rgba(8,5,20,0.24)] backdrop-blur-xl">
                  Let’s get you back
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}