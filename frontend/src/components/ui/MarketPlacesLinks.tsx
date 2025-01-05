import Image from "next/image";

interface MarketPlacesLinksProps {
  domain: string;
}

const MarketPlacesLinks: React.FC<MarketPlacesLinksProps> = ({ domain }) => {
  return (
    <div className="flex gap-1 items-center justify-center">
      <a
        href={`https://majestic.com/reports/site-explorer?q=${domain}&oq=${domain}&IndexDataSource=F`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <Image
          src={"/images/icons/IconMajesctic.svg"}
          alt="IconMajesctic"
          width={16}
          height={16}
          className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
        />
        <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Majestic
        </span>
      </a>

      <a
        href={`https://app.seobserver.com/sites/view/${domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <Image
          src={"/images/icons/IconSeobserver.svg"}
          alt="IconSeobserver"
          width={16}
          height={16}
          className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
        />
        <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Seobserver
        </span>
      </a>

      <a
        href={`https://www.semrush.com/analytics/overview/?q=${domain}&protocol=https&searchType=domain`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <Image
          src={"/images/icons/IconSemrush.svg"}
          alt="IconSemrush"
          width={16}
          height={16}
          className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
        />
        <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Semrush
        </span>
      </a>

      <a
        href={`https://app.ahrefs.com/v2-site-explorer/overview?target=${domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <Image
          src={"/images/icons/IconAhrefs.svg"}
          alt="IconAhrefs"
          width={16}
          height={16}
          className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
        />
        <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Ahrefs
        </span>
      </a>

      <a
        href={`https://tool.haloscan.com/domain/overview?input=${domain}&mode=root&autoLoad=true`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <Image
          src={"/images/icons/IconHaloScanMonochrome.svg"}
          alt="IconHaloScanMonochrome"
          width={16}
          height={16}
          className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
        />
        <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          HaloScan
        </span>
      </a>
    </div>
  );
};

export default MarketPlacesLinks;
