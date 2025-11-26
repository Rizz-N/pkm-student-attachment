
const Card = (props) => {
  return (
    <div className={props.container} > 
      <div className={props.top}>
        <p>{props.title}</p>
        <div className="text-3xl">
          {props.icon}
        </div>
      </div>
      <div>
        <h1 className={props.rstyle} >{props.result}</h1>
      </div>
    </div>
  )
}

export default Card
