import React from "react";
import { TiShoppingCart } from "react-icons/ti";

interface DynamicPriceProps {
  source: string;
  price: number;
  domain: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showSource?: boolean; // New prop to control the visibility of the source
}

const DynamicPrice: React.FC<DynamicPriceProps> = ({
  source,
  price,
  domain,
  onClick,
  showSource = true, // Default to true if not provided
}) => {
  const getDynamicPrice = (source: string, price: number, domain: string) => {
    switch (source) {
      case "Paperclub":
        return (
          <a
            href={`https://app.paper.club/annonceur/resultats?type=simple&term=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Seojungle":
        return (
          <a
            href={`https://app.Seojungle.com/search?searchField=${domain}&priceMax=110.6`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Prensalink":
        return (
          <a
            href={`https://shop.prensalink.com/products/medias`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      default:
        return price; // Default price
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="w-24 h-7 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-2"
        onClick={onClick}
      >
        <TiShoppingCart />
        {getDynamicPrice(source, price, domain)}
      </button>
      {showSource && <span>{source}</span>}
    </div>
  );
};

export default DynamicPrice;
