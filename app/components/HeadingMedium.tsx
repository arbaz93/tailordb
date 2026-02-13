type HeadingMediumProps = {
  /** Text to display */
  text: string;

  /** Additional CSS classes (Tailwind) */
  css?: string;
};

export default function HeadingMedium({ text, css = "" }: HeadingMediumProps) {
  return (
    <h2
      className={`text-heading-200 capitalize font-medium text-clr-100 max-w-[80vw] ${css}`}
    >
      {text}
    </h2>
  );
}
