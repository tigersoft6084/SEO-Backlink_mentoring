// components/LocationHeader.tsx
import { FC } from "react";

const LocationHeader: FC<{ location: string }> = ({ location }) => (
  <div className="flex items-center text-blue-500 font-medium mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 2c4.418 0 8 3.582 8 8 0 5.25-8 12-8 12S4 15.25 4 10c0-4.418 3.582-8 8-8z"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
    {location}
  </div>
);

export default LocationHeader;
