
function Card({ title, className = '', id, brand, text, alt = '', image }) {
  return (
    <article id={id} className={className}>
      <div className='content'>
        <img className="brand" src={brand} alt="brand logo" />
        <div className="text-content">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      </div>
      <img className="product" src={image} alt={alt} />
    </article>
  );
}

export default Card;
