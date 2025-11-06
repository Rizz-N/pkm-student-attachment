
const Card = (props) => {
  return (
    <div className={props.container} > 
      <div className={props.top}>
        <p>{props.title}</p>
        <img src={props.source} alt="icon" />
      </div>
      <div>
        <h1 className={props.rstyle} >{props.result}</h1>
      </div>
    </div>
  )
}

export default Card
