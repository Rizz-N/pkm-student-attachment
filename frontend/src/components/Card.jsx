import React from "react";
const Card = (props) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
    indigo: "text-indigo-600 bg-indigo-100",
  };

  return (
    <div className={props.container}>
      <div className={props.top}>
        <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {props.title}
        </div>
        <div
          className={`text-xl rounded-full p-2 sm:text-2xl ${
            colorClasses[props.color]
          }`}
        >
          {props.icon}
        </div>
      </div>
      <div>
        <div className={`${props.rstyle} text-3xl sm:text-4xl mt-6 font-bold`}>
          {props.result}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);
