import Navbar from "../../components/common/Navbar";


export default function Home() {
  const menuItems = ['Bulk Search', 'Keyword Search', 'Competitive Analysis', 'Projects', 'Expired Domains', 'Serp Scanner'];
  const quotaUsed = [
    { name: 'Backlinks', value: 10, max: 500 },
    { name: 'Plugin', value: 0, max: 1000 },
    { name: 'Keyword Searches', value: 11, max: 250 },
    { name: 'Competitive Analysis', value: 4, max: 100 },
    { name: 'SERP Scanner', value: 0, max: 100 },
  ];

  const handleSearch = () => {
    console.log('Search initiated');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        {/* <Sidebar menuItems={menuItems} quotaUsed={quotaUsed} />
        <DynamicContent
          title="Keyword Search"
          description="Enter up to 20 keywords (1 per line) to scan Google SERPs"
          placeholder="Paste URLs"
          onSearch={handleSearch}/> */}
      </div>
    </div>
  );
}
