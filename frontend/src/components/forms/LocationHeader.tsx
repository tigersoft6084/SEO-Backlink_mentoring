import { FC, useState } from "react";
import { IoChevronDown } from "react-icons/io5"; // For dropdown icon
import { FiMapPin } from "react-icons/fi";
import Image from "next/image"; // Import Image from next/image

interface LocationHeaderProps {
  location: string;
  setLocation: (location: string) => void;
}

const locations = [
  { name: "United States", code: "2840", flag: "images/flags/united-states.png" },
  { name: "United Kingdom", code: "2826", flag: "images/flags/united-kingdom.png" },
  { name: "Canada", code: "2124", flag: "images/flags/canada.png" },
  { name: "Spain", code: "2724", flag: "images/flags/spain.png" },
  { name: "France", code: "2250", flag: "images/flags/france.png" },
  { name: "Germany", code: "2276", flag: "images/flags/germany.png" },
  { name: "Brazil", code: "2076", flag: "images/flags/brazil.png" },
  { name: "Portugal", code: "2620", flag: "images/flags/portugal.png" },
  { name: "Italy", code: "2380", flag: "images/flags/italy.png" },
  { name: "Belgium", code: "2056", flag: "images/flags/belgium.png" },
  { name: "Switzerland", code: "2756", flag: "images/flags/switzerland.png" },
];

const LocationHeader: FC<LocationHeaderProps> = ({ location, setLocation }) => {
  const selectedLocation = locations.find((loc) => loc.code === location) || locations[0]; // Default location
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectLocation = (code: string) => {
    setLocation(code);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="flex items-center space-x-3 text-blue-600 font-medium mb-5">
      <div className="relative w-64">
        {/* Select Box with SVG & Flag */}
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 shadow-sm w-full relative">
          {/* Location Pin Icon */}
          <FiMapPin className="w-8 h-8 text-blue-500 mr-2" />

          {/* Flag Image using next/image */}
          <Image
            src={`/${selectedLocation.flag}`} // Ensure to add a leading slash
            alt={selectedLocation.name}
            width={24} // Set appropriate width
            height={24} // Set appropriate height
            className="mr-2"
          />

          {/* Custom Dropdown */}
          <div
            className="flex justify-between items-center cursor-pointer w-full"
            onClick={toggleDropdown}
          >
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {selectedLocation.name}
            </span>
            <IoChevronDown className="w-5 h-5 text-gray-500" />
          </div>
          
          {/* Dropdown options */}
          {isOpen && (
            <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
              {locations.map((loc) => (
                <div
                  key={loc.code}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelectLocation(loc.code)}
                >
                  <Image
                    src={`/${loc.flag}`} // Ensure to add a leading slash
                    alt={loc.name}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {loc.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationHeader;
