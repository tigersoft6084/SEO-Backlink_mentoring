import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import MarketPlacesLinks from "./MarketPlacesLinks";
import DynamicPrice from "./ShopingCartAndPrice";

interface Row {
  domain: string;
  RD: number;
  TF: number;
  CF: number;
  price: number;
  source: string;
  keyword: string;
}

interface Seller {
  source: string;
  price: number;
}

interface RightSidebarProps {
  visible: boolean;
  data: Row | null;
  sellers: Seller[];
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ visible, data, sellers, onClose }) => {
  if (!visible || !data) return null;

  return (
    <div className="px-4 py-4 fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-700 shadow-lg z-50">

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
      <div className="p-4 flex items-center justify-between gap-[96px]">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 font-bold">RD</span>
            <span className="text-sm font-bold">{data.RD}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 font-bold">TF</span>
            <span className="text-sm font-bold">{data.TF}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 font-bold">CF</span>
            <span className="text-sm font-bold">{data.CF}</span>
          </div>
        </div>
        <div style={{ marginBottom: "-20px" }}>
          <MarketPlacesLinks domain={data.domain} />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-600" />

      {/* Sellers and Prices Table */}
      <div className="p-4 flex justify-center items-center space-x-[96px]">

        <div className="overflow-y-auto max-h-64 justify-center items-center">

          <table className="w-full text-center border-collapse justify-center items-center">

            <thead>
              <tr>
                <th className="py-2 text-sm font-bold text-gray-700 dark:text-gray-300 text-center">Seller</th>
                <th className="py-2 text-sm font-bold text-gray-700 dark:text-gray-300 text-center">Price</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((seller, index) => (
                <tr key={index} className="dark:border-gray-600">
                  {/* Seller Column */}
                  <td className="py-2 px-6 text-gray-800 dark:text-gray-200 text-left">
                    {seller.source}
                  </td>

                  {/* Price Column */}
                  <td className="py-2 px-6 text-gray-800 dark:text-gray-200 text-right">
                    <DynamicPrice
                      source={seller.source}
                      price={seller.price}
                      domain={data.domain}
                      onClick={(e) => e.stopPropagation()}
                      showSource={false}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default RightSidebar;
