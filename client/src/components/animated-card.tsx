import { motion } from "framer-motion";
import { Card, CardProps } from "@/components/ui/card";

interface AnimatedCardProps extends CardProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = "", 
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={`transition-all duration-200 ${className}`} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}