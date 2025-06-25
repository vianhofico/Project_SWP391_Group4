const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchBar;