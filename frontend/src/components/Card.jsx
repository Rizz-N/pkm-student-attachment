
const Card = (props) => {
  return (
    <div className={props.container} > 
      <div className={props.top}>
        <p>{props.title}</p>
        <div className="text-2xl sm:text-sm md:text-2xl font-medium">
          {props.icon}
        </div>
      </div>
      <div>
        <h1 className={`{props.rstyle} text-3xl sm:text-3xl md:text-4xl mt-9 `} >
          {props.result}
        </h1>
      </div>
    </div>
  )
}

export default Card
