import React from 'react'

function Card({ heading, text, color, logoUrl, imageUrl }) {


  return (
    <div className="card" style={{ backgroundColor: color }}>
      <div className="text-container">
        <img src={logoUrl} alt={heading} className="logo" />
        <div className="text text-content">
          <h2>{heading} </h2>
          <hr />
          <p>{text}</p>
        </div>
      </div>
      <div className="image">
        <img src={imageUrl} alt={heading} />
      </div>

    </div>
  )
}

export default Card
