import React from 'react';

interface SearchResultProps {
  result: {
    answer: string;
  };
}

const SearchResult = ({ result }: SearchResultProps) => {
  const assetNames = result?.answer?.split(',').map((item) => item.trim());

  if (!assetNames || assetNames.length === 0) return null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Assets Found:</h2>
      <ul className="list-disc list-inside space-y-1 max-h-96 overflow-y-auto">
        {assetNames.map((name, index) => (
          <li key={index} className="text-sm text-gray-700">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
