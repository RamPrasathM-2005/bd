import { motion } from 'framer-motion';
import { childhoodPhoto } from '../lib/assets.js';
import DigitalHug from './DigitalHug.jsx';
import PhotoFrame from './PhotoFrame.jsx';
import StarMap from './StarMap.jsx';

const storyLines = [
  'If this little girl knew how many lives she would brighten...',
  'If she knew she would grow into the soul that inspires everyone around her...',
  'She would be so proud of the woman you are today.'
];

function StoryLine({ line }) {
  return (
    <motion.p
      className="max-w-2xl text-balance font-serif text-4xl leading-tight text-pearl sm:text-5xl lg:text-6xl"
      initial={{ opacity: 0.12, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.65 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {line}
    </motion.p>
  );
}

export default function Celebration() {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(246,217,139,0.22),transparent_30%),linear-gradient(180deg,#06111f_0%,#10213a_50%,#050912_100%)]">
      <section className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-16">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(246,217,139,0.24),transparent_22%)]"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 2.1, opacity: [0, 1, 0.35] }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.45em] text-celestial">May 20</p>
          <h1 className="mt-5 font-serif text-6xl leading-none text-pearl sm:text-8xl lg:text-9xl">Sri Devi</h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-moon/82 sm:text-xl">
            Today, the quiet sketch becomes color. Today, the whole sky gets to remember her.
          </p>
        </motion.div>
      </section>

      <section className="relative min-h-[240vh] px-5">
        <div className="sticky top-0 mx-auto grid min-h-screen max-w-7xl items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            className="relative mx-auto w-full max-w-md shadow-halo lg:max-w-lg"
            animate={{ scale: [1, 1.025, 1], filter: ['brightness(1)', 'brightness(1.08)', 'brightness(1)'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PhotoFrame src={childhoodPhoto} alt="Sri Devi as a child" mode="color" className="aspect-[4/5]" />
            <StarMap />
          </motion.div>

          <div className="flex min-h-[70vh] flex-col justify-center gap-[32vh] py-[18vh]">
            {storyLines.map((line) => (
              <StoryLine key={line} line={line} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-h-screen place-items-center px-5 py-24 text-center">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-serif text-5xl leading-tight text-pearl sm:text-7xl">Happy Birthday, Sri Devi.</p>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-moon/82">
            May this year hold you as gently as you hold everyone else, and may every room you enter remember it has become brighter.
          </p>
        </motion.div>
      </section>

      <DigitalHug />
    </div>
  );
}
