
import { useState, useEffect } from "react";
import Card from "./components/card";
import './components/style.css';

export default function App() {
  const [datas, setDatas] = useState([]);
  
  useEffect(() => {
    fetch('https://krds-assignment.github.io/aoc/api-assets/data.json')
      .then(res => res.json())
      .then(data => setDatas(data.features));
  }, []);
  
  return (
    <div className="wrapper">
      <div className="grid">
        {datas.map((data, index) => (
          <Card 
            key={data.name}
            className={`card card${(index % 6) + 1}`}
            title={data.title}
            text={data.desc}
            brand={data.logo}
            image={data.image}
          />
        ))}
      </div>
    </div>
  );
}
