import { useState, useRef, useEffect } from "react"
import { IoIosArrowDropdown } from "react-icons/io";

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState()
    const [selectedOption, setSelectedOption] = useState({
        value:'hadir',
        Label:'Hadir',
        color:'bg-green-500 text-white'
    });

    const dropdownRef = useRef(null);

    const option =[
        {value:'Hadir', Label:'Hadir',color:'bg-green-500 text-white hover:bg-green-600'},
        {value:'Sakit', Label:'Sakit',color:'bg-yellow-500 text-white hover:bg-yellow-600'},
        {value:'Izin', Label:'Izin',color:'bg-blue-500 text-white hover:bg-blue-600'},
        {value:'Tidak Hadir', Label:'Tidak Hadir',color:'bg-red-500 text-white hover:bg-red-600'},
    ];

    useEffect(()=>{
        const handleClickOutside = (event) =>{
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
    }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button type="button" className={`w-full border rounded-xl py-1 px-2 text-left flex justify-between items-center ${selectedOption.color}`} onClick={()=> setIsOpen(!isOpen)} >
            <span>{selectedOption.Label}</span>
            <span><IoIosArrowDropdown/></span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full border-2 rounded-xl bg-white shadow-lg" >
            {option.map((option)=>(
                <div key={option.value} className={`py-1 px-2 cursor-pointer ${option.color} first:rounded-t-xl last:rounded-b-xl`} onClick={()=>{setSelectedOption(option); setIsOpen(false); }}>
                    {option.Label}
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
