import Title from './Title';
import Table from './Table';
import SearchLinkButton from './SearchLinkButton';

export default function DynamicContent({ title, description, placeholder, onSearch }) {
  return (
    <div className="flex-1 p-6">
      <Title title={title} description={description} />
      <Table placeholder={placeholder} />
      {/* <SearchLinkButton onClick={onSearch} /> */}
    </div>
  );
}
