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
      case "Boosterlink":
        return (
          <a
            href={`https://pro.boosterlink.fr/comparateurs.aspx`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Develink":
        return (
          <a
            href={`https://app.develink.com/cataloguevip?search_type=search_url&search_domain=${domain}&code=JGADANHO`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Ereferer":
        return (
          <a
            href={`https://fr.ereferer.com/bo/exchange-site-find?search=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Getalink":
        return (
          <a
            href={`https://www.getalink.com/sistema/cliente/medio/?nombre=${domain}&tipo_enlace..............`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Linkavistar":
        return (
          <a
            href={`https://linkavista.com/linkfinder/?domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "<Mistergoodlink>":
        return (
          <a
            href={`https://app.mistergoodlink.com/shop?ref=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
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
            href={`https://app.seo-jungle.com/search?searchField=${domain}&priceMax=110.6`}
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
      case "123media":
        return (
          <a
            href={`https://123.media/?url=${domain}&code=29ae667983`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Presswhizz":
        return (
          <a
            href={`https://app.presswhizz.com/marketplace?portalName=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Prnews":
        return (
          <a
            href={`https://prnews.io/sites/query/${domain}/?i=3745304`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Backlinked":
        return (
          <a
            href={`https://backlinked.com/?ref=mzu2nwe&domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Growwer":
        return (
          <a
            href={`https://growwer.com/?af=3dce24df39a94a6a92b3f83951f0a618&domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Linkbroker":
        return (
          <a
            href={`https://app.linkbroker.de/en/contentlinks?domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Whitepress":
        return (
          <a
            href={`https://www.whitepress.com/Xn9pi`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Linkatomic":
        return (
          <a
            href={`https://app.linkatomic.com/register/r/6b04380b67c55d6075bc2f0a9534f0cd?domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Linkbuilders":
        return (
          <a
            href={`https://app.link.builders/links?domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Motherlink":
        return (
          <a
            href={`https://app.motherlink.io/market?domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Mynilinks":
        return (
          <a
            href={`https://app.mynilinks.fr/netlinkings?country=&category=&url=${domain}&ttf=&tf_min=&tf_max=&cf_min=&cf_max=&dr_min=&dr_max=&mots_cles=&traffic_min=&traffic_max=&min_price=&max_price=&pagination=10&sponsor_id=7e2c23fd-5929-4a0d-b3f1-94eed47dcb1f`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Unancor":
        return (
          <a
            href={`https://app.unancor.com/?aaf=ed161410-1f90-11ef-b5c7-0e52f3fe678a&domain=${domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Publisuites":
        return (
          <a
            href={`https://www.publisuites.com/advertisers/websites/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Lemmilink":
        return (
          <a
            href={`https://app.lemmilink.fr/AnnonceMode?url=${domain}&ref=cc6f3b`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Soumettre":
        return (
          <a
            href={`https://soumettre.fr/user/catalog?url=${domain}&parrain=DJKOXI`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Boosterlink":
        return (
          <a
            href={`https://pro.boosterlink.fr/comparateurs.aspx`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {price}
          </a>
        );
      case "Dealerdetemps":
        return (
          <a
            href={`https://www.dealerdetemps.com/les-sites/`}
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
