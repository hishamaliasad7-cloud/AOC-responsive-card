import { useEffect, useState } from 'react'
import Card from './components/Card'
import './App.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function App() {
  const [cards, setCards] = useState([])
  const navigate = useNavigate()

  const fetchCards = () => {
    axios.get('/features')
      .then(datas => setCards(datas.data))
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const handleEdit = (id) => navigate(`/admin/${id}`)

  const handleDelete = async (id) => {
    await axios.delete(`/features/${id}`)
    fetchCards()
  }

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
            onEdit={handleEdit}
            onDelete={handleDelete}
            color={data.color}
          />
        })}
      </div>
    </>
  )
}

export default App


