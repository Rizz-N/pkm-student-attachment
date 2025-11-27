
const Card = (props) => {
  return (
    <div className={props.container} > 
      <div className={props.top}>
        <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {props.title}
        </p>
        <div className="text-xl sm:text-2xl font-medium">
          {props.icon}
        </div>
      </div>
      <div>
        <h1 className={`${props.rstyle} text-3xl sm:text-4xl mt-6 font-bold`} >
          {props.result}
        </h1>
      </div>
    </div>
  )
}

export default Card
