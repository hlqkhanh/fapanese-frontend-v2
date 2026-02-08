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
  if (!passage) return null;

  return (
    <div className="p-6 bg-cyan-50/50 border-l-4 border-cyan-400 rounded-lg shadow-sm">
      {/* Main passage in Japanese */}
      <p className="text-lg text-gray-900 mb-3 leading-relaxed font-medium">
        {passage}
      </p>

      {/* Romaji (reading) */}
      {romaji && (
        <p className="text-base text-gray-600 mb-2 italic">
          <span className="font-semibold text-gray-700">Romaji: </span>
          {romaji}
        </p>
      )}

      {/* Vietnamese meaning */}
      {meaning && (
        <p className="text-base text-gray-700">
          <span className="font-semibold text-gray-800">Nghĩa: </span>
          {meaning}
        </p>
      )}
    </div>
  );
}
