import { motion, AnimatePresence } from "framer-motion";
import NavTabButtons from "@/components/course/NavTabButtons";

interface FloatingNavBarProps {
  show: boolean;
  activeTab: "lesson" | "exercise";
  onTabChange: (tab: "lesson" | "exercise") => void;
}

const FloatingNavBar = ({ show, activeTab, onTabChange }: FloatingNavBarProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="floating-nav"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999]"
        >
          <NavTabButtons
            activeTab={activeTab}
            onTabChange={onTabChange}
            isFloating={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNavBar;
