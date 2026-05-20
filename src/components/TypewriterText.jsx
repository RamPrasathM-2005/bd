import { motion } from 'framer-motion';

export default function TypewriterText({ text }) {
  return (
    <p className="mx-auto max-w-2xl text-balance text-center font-serif text-2xl leading-relaxed text-pearl sm:text-4xl">
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.045, duration: 0.02 }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="ml-1 inline-block h-8 w-px translate-y-1 bg-celestial sm:h-10"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
    </p>
  );
}
