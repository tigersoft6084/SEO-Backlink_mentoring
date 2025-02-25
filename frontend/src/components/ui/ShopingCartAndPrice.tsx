import React from "react";
import { TiShoppingCart } from "react-icons/ti";

interface DynamicPriceProps {
  source: string;
  price: number;
  domain: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
        return `https://pro.boosterlink.fr/comparateurs.aspx`;
      case "Develink":
        return `https://app.develink.com/cataloguevip?search_type=search_url&search_domain=${domain}&code=JGADANHO`;
      case "Ereferer":
        return `https://fr.ereferer.com/bo/exchange-site-find?search=${domain}`;
      case "Getalink":
        return `https://www.getalink.com/sistema/cliente/medio/?nombre=${domain}`;
      case "Linkavistar":
        return `https://linkavista.com/linkfinder/?domain=${domain}`;
      case "<Mistergoodlink>":
        return `https://app.mistergoodlink.com/shop?ref=${domain}`;
      case "Paperclub":
        return `https://app.paper.club/annonceur/resultats?type=simple&term=${domain}`;
      case "Seojungle":
        return `https://app.seo-jungle.com/search?searchField=${domain}&priceMax=110.6`;
      case "Prensalink":
        return `https://shop.prensalink.com/products/medias`;
      case "123media":
        return `https://123.media/?url=${domain}&code=29ae667983`;
      case "Presswhizz":
        return `https://app.presswhizz.com/marketplace?portalName=${domain}`;
      case "Prnews":
        return `https://prnews.io/sites/query/${domain}/?i=3745304`;
      case "Backlinked":
        return `https://backlinked.com/?ref=mzu2nwe&domain=${domain}`;
      case "Growwer":
        return `https://growwer.com/?af=3dce24df39a94a6a92b3f83951f0a618&domain=${domain}`;
      case "Linkbroker":
        return `https://app.linkbroker.de/en/contentlinks?domain=${domain}`;
      case "Whitepress":
        return `https://www.whitepress.com/Xn9pi`;
      case "Linkatomic":
        return `https://app.linkatomic.com/register/r/6b04380b67c55d6075bc2f0a9534f0cd?domain=${domain}`;
      case "Linkbuilders":
        return `https://app.link.builders/links?domain=${domain}`;
      case "Motherlink":
        return `https://app.motherlink.io/market?domain=${domain}`;
      case "Mynilinks":
        return `https://app.mynilinks.fr/netlinkings?country=&category=&url=${domain}&ttf=&tf_min=&tf_max=&cf_min=&cf_max=&dr_min=&dr_max=&mots_cles=&traffic_min=&traffic_max=&min_price=&max_price=&pagination=10&sponsor_id=7e2c23fd-5929-4a0d-b3f1-94eed47dcb1f`;
      case "Unancor":
        return `https://app.unancor.com/?aaf=ed161410-1f90-11ef-b5c7-0e52f3fe678a&domain=${domain}`;
      case "Publisuites":
        return `https://www.publisuites.com/advertisers/websites/`;
      case "Lemmilink":
        return `https://app.lemmilink.fr/AnnonceMode?url=${domain}&ref=cc6f3b`;
      case "Soumettre":
        return `https://soumettre.fr/user/catalog?url=${domain}&parrain=DJKOXI`;
      case "Boosterlink":
        return `https://pro.boosterlink.fr/comparateurs.aspx`;
      case "Dealerdetemps":
        return `https://www.dealerdetemps.com/les-sites/`;
      default:
        return '#'; // Default price
    }
  };

  const href = getDynamicPrice(source, price, domain);

  return (
    <div className="flex items-center gap-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-24 h-7 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-2"
        onClick={onClick} // Correctly typed for HTMLAnchorElement
      >
        <TiShoppingCart />
        {price}
      </a>
      {showSource && <span>{source}</span>}
    </div>
  );
};

export default DynamicPrice;
