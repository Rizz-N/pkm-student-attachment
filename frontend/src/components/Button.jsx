
const Button = (props) => {
  return (
      <button onClick={props.click} className={`border-2 inline-block py-1 px-4 text-xl rounded-xl cursor-pointer ${props.className}`}>{props.name}</button>
  )
}

export default Button
