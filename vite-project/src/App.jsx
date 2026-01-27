import { useEffect, useState } from 'react'
import Card from './components/Card'
import './App.css'

import axios from 'axios'

function App() {
  const [cards, setCards] = useState([])


  const fetchCards = async () => {
    try {
      const response = await axios.get('http://192.168.1.92:3000/features')
      setCards(response.data)
    } catch (error) {
      console.error('Failed to fetch cards:', error.message)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])
  return (
    <>
      <div className='grid'>
        {cards.filter(card => card.active !== false).map((data) => {
          return <Card
            key={data.id}
            logoUrl={data.logo}
            heading={data.title}
            text={data.description}
            imageUrl={data.image}
            id={data.id}
            color={data.color}
          />
        })}
      </div>
    </>
  )
}

export default App

