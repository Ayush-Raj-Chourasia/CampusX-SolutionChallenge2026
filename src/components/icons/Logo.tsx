import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-3xl" },
  };

  return (
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary p-1.5"
        style={{ width: sizes[size].icon, height: sizes[size].icon }}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-full h-full"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" className="fill-primary-foreground/20 stroke-primary-foreground" />
          <path d="M2 17l10 5 10-5" className="stroke-primary-foreground" />
          <path d="M2 12l10 5 10-5" className="stroke-primary-foreground" />
        </svg>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
      </div>
      {showText && (
        <span className={`font-display font-bold ${sizes[size].text} text-foreground`}>
          Campus<span className="text-secondary">X</span>
        </span>
      )}
    </motion.div>
  );
};
