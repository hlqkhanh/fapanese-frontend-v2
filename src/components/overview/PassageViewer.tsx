import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PassageViewerProps {
  passage?: string;
  romaji?: string;
  meaning?: string;
}

/**
 * Component to display a passage with romaji and meaning
 * Used in speaking exercises
 */
export function PassageViewer({ passage, romaji, meaning }: PassageViewerProps) {
  const [showRomaji, setShowRomaji] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  if (!passage) return null;

  return (
    <div className="space-y-3">
      {/* Toggle Buttons */}
      {(romaji || meaning) && (
        <div className="flex gap-2">
          {romaji && (
            <Button
              variant={showRomaji ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRomaji(!showRomaji)}
              className="gap-2"
            >
              {showRomaji ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showRomaji ? "Ẩn Romaji" : "Hiện Romaji"}
            </Button>
          )}
          {meaning && (
            <Button
              variant={showMeaning ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMeaning(!showMeaning)}
              className="gap-2"
            >
              {showMeaning ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showMeaning ? "Ẩn Nghĩa" : "Hiện Nghĩa"}
            </Button>
          )}
        </div>
      )}

      <div className="p-6 bg-cyan-50/50 border-l-4 border-cyan-400 rounded-lg shadow-sm">
        {/* Main passage in Japanese */}
        <p className="text-lg text-gray-900 mb-3 leading-relaxed font-medium">
          {passage}
        </p>

        {/* Romaji (reading) - Hidden by default */}
        {showRomaji && romaji && (
          <p className="text-base text-gray-600 mb-2 italic pt-2 border-t border-cyan-200">
            <span className="font-semibold text-gray-700">Romaji: </span>
            {romaji}
          </p>
        )}

        {/* Vietnamese meaning - Hidden by default */}
        {showMeaning && meaning && (
          <p className="text-base text-gray-700 pt-2 border-t border-cyan-200">
            <span className="font-semibold text-gray-800">Nghĩa: </span>
            {meaning}
          </p>
        )}
      </div>
    </div>
  );
}
