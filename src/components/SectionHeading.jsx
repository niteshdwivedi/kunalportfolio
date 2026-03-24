const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="max-w-2xl">
    <span className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
      {eyebrow}
    </span>
    <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
      {title}
    </h2>
    <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">
      {description}
    </p>
  </div>
);

export default SectionHeading;
