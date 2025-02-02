// components/SearchButton.tsx
import { FC } from "react";
import { FaSearch } from "react-icons/fa";
import LoadingButton from "./LoadingButton";

interface SearchButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const SearchButton: FC<SearchButtonProps> = ({disabled, onClick }) => (
  <button
    className={`mt-4 px-6 py-2 bg-gradient-to-r text-white font-medium rounded-lg flex items-center space-x-2 self-end ${
      !disabled
        ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        : "from-blue-300 to-purple-300 cursor-not-allowed"
    }`}
    disabled={disabled}
    onClick={onClick}
  >
    <FaSearch />
    <span>Find Links</span>
  </button>
);

export default SearchButton;
