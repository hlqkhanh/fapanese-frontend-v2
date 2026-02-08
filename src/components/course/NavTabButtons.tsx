import { motion } from "framer-motion";

interface NavTabButtonsProps {
  activeTab: "lesson" | "exercise";
  onTabChange: (tab: "lesson" | "exercise") => void;
  isFloating?: boolean;
}

const NavTabButtons = ({ activeTab, onTabChange, isFloating = false }: NavTabButtonsProps) => {
  return (
    <div
      className={`relative flex justify-between w-72 mx-auto bg-gray-200 rounded-full p-1 shadow-inner overflow-hidden ${
        isFloating ? "shadow-2xl" : ""
      }`}
    >
      <motion.div
        className="absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] shadow-md"
        animate={{
          left: activeTab === "lesson" ? "2%" : "48%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {["lesson", "exercise"].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab as "lesson" | "exercise")}
          className={`relative z-[20] w-1/2 py-2 text-base font-semibold rounded-full transition-all duration-300 ${
            activeTab === tab
              ? "text-[#00838F]"
              : "text-gray-600 hover:text-[#00BCD4]"
          }`}
        >
          {tab === "lesson" ? "Bài học" : "Bài tập"}
        </button>
      ))}
    </div>
  );
};

export default NavTabButtons;
