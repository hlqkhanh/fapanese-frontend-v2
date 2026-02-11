import { Link } from "react-router-dom";
import type { OverviewPart } from "@/types/overview";

interface OverviewSidebarProps {
  parts: OverviewPart[];
  currentPartId: number;
  courseCode: string;
  overviewId: number;
}

/**
 * Sidebar navigation for overview parts
 */
export function OverviewSidebar({
  parts,
  currentPartId,
  courseCode,
  overviewId,
}: OverviewSidebarProps) {
  return (
    <aside className="w-full md:w-[320px] flex-shrink-0 mb-10 md:mb-0">
      <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-[120px]">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
          Mục lục ôn tập
        </h3>
        <nav className="space-y-2">
          {parts.map((part) => {
            const isActive = part.id === currentPartId;
            return (
              <Link
                key={part.id}
                to={`/overview/${courseCode}/${overviewId}/${part.id}`}
                className={`
                  flex items-center w-full text-left px-5 py-2.5 rounded-xl transition-all duration-300 text-lg font-medium
                  ${
                    isActive
                      ? "bg-gradient-primary text-white shadow-lg transform scale-[1.03] hover:opacity-90"
                      : "text-gray-800 hover:bg-cyan-50 hover:text-cyan-700"
                  }
                `}
              >
                <span className="ml-3 truncate">{part.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
