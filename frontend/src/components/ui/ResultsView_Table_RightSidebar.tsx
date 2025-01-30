import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import MarketPlacesLinks from "./MarketPlacesLinks";
import DynamicPrice from "./ShopingCartAndPrice";

interface Row {
  domain: string;
  rd: number;
  tf: number;
  cf: number;
  price: number;
  source: string;
  keyword: string;
}

interface Seller {
  marketplace_source: string;
  price: number;
}

interface RightSidebarProps {
  visible: boolean;
  data: Row | null;
  sellers: Seller[];
  onClose: () => void;
}

const validSellers = [
  "Ereferer",
  "Paperclub",
  "Bulldoz",
  "Prensalink",
  "Linkatomic",
  "Backlinked",
  "Conexoo",
  "Prnews",
  "Seojungle",
  "Soumette",
  "Dealerdetemps",
  "123media",
  "Mynilinks",
  "Unancor",
  "Linkbroker",
  "Linkbuilders",
  "Whitepress",
  "Linkavista",
  "Develink",
  "Boosterlink",
  "Mistergoodlink",
  "Growwer",
  "Publisuites",
  "Motherlink",
  "Getalink",
  "Lenmilink",
  "Presswhizz",
];

const RightSidebar: React.FC<RightSidebarProps> = ({ visible, data, sellers, onClose }) => {
  if (!visible || !data) return null;

  return (
    <div className="px-4 fixed top-0 right-0 h-full w-96 bg-white dark:bg-slate-800 shadow-lg z-50 flex flex-col">
      {/* Close Button */}
      <div className="p-4 dark:border-gray-500">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 float-right"
        >
          <IoCloseSharp size={25} />
        </button>
      </div>

      {/* Domain Name */}
      <div className="p-4 text-blue-600 text-xl font-bold text-center">
        <a
          href={`https://${data.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {data.domain}
        </a>
      </div>

      {/* Price and Metrics */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 font-bold">RD</span>
            <span className="text-sm font-bold">{data.rd}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 font-bold">TF</span>
            <span className="text-sm font-bold">{data.tf}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 font-bold">CF</span>
            <span className="text-sm font-bold">{data.cf}</span>
          </div>
        </div>
        <div style={{ marginBottom: "-20px" }}>
          <MarketPlacesLinks domain={data.domain} />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-600 py-2" />

      {/* Sellers and Prices Table */}
      <div className="flex-grow overflow-y-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="py-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Seller
              </th>
              <th className="py-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {validSellers.map((validSeller) => {
              const matchingSeller = sellers.find(
                (seller) => seller.marketplace_source === validSeller
              );
              return (
                <tr key={validSeller} className="dark:border-gray-600">
                  {/* Seller Column */}
                  <td className="py-2 px-6 text-gray-800 dark:text-gray-200 text-center">
                    {validSeller}
                  </td>

                  {/* Price Column */}
                  <td className="py-2 px-6 text-gray-800 dark:text-gray-200 text-center flex justify-center items-center">
                    {matchingSeller ? (
                      <DynamicPrice
                        source={matchingSeller.marketplace_source}
                        price={matchingSeller.price}
                        domain={data.domain}
                        onClick={(e) => e.stopPropagation()}
                        showSource={false}
                      />
                    ) : (
                      <IoCloseSharp size={20} className="text-red-500" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RightSidebar;
