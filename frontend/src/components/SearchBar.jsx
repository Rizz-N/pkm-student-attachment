import { GoSearch } from "react-icons/go";

const SearchBar = (props) => {
  return (
    <div className="relative">
      <GoSearch className="absolute text-2xl left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="search"
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        className="w-full border-2 border-gray-300 pl-10 pr-3 py-2 rounded-xl text-base focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
