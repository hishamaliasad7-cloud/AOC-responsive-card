import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './AdminPage.css'

function AdminPage() {
  const API_URL = 'http://localhost:3000/features'
  const [cards, setCards] = useState([])
  const [editCardId, setEditCardId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const fetchCards = async () => {
    const res = await axios.get(API_URL)
    setCards(res.data)
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const resetForm = () => {
    setEditCardId(null)
  }

  const handleAddCard = () => {
    const newCard = {
      title: "",
      description: "",
      logo: "",
      color: "",
      image: "",
      active: true,
      logoName: "",
      imageName: ""
    }
    setCards(prev => [...prev, newCard])
  }


  const handleFileChange = (e, id, field, nameField) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setCards(prev =>
        prev.map(card =>
          card.id === id ? { ...card, [field]: reader.result, [nameField]: file.name } : card
        )
      )
    }
    reader.readAsDataURL(file)
  }

  const handleCardChange = (id, field, value) => {
    setEditCardId(id)
    setCards(prev =>
      prev.map((card, index) =>
        (card.id === id || (!card.id && index === id)) ? { ...card, [field]: value } : card
      )
    )
  }

  const handleCardImageChange = (e, id, field) => {
    const file = e.target.files[0]
    if (!file) return
    setEditCardId(id)
    const reader = new FileReader()
    reader.onloadend = () => {
      setCards(prev =>
        prev.map(card =>
          card.id === id
            ? { ...card, [field]: reader.result, [`${field}Name`]: file.name }
            : card
        )
      )
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (card) => {
    try {
      if (card.id) {
        const res = await axios.put(`${API_URL}/${card.id}`, card)
        setCards((prev) => prev.map(c => c.id === card.id ? res.data : c))
        setSuccessMessage('Card updated successfully!')
      } else {
        const res = await axios.post(API_URL, card)
        setCards((prev) => prev.map(c => !c.id ? res.data : c))
        setSuccessMessage('Card added successfully!')
      }
      setTimeout(() => setSuccessMessage(''), 3000)
      setEditCardId(null)
    } catch (error) {
      console.log('Save error:', error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setCards((prev) => prev.filter(card => card.id !== id))
      console.log(cards)
    } catch (error) {
      console.log('Delete error:', error.message)
    }
  }

  return (
    <>
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {successMessage}
        </div>
      )}
      <div className='nav'>
        <h1 className='heading'>All Cards</h1>
        <button
          className='add-button'
          onClick={handleAddCard}
        >
          Add a Card
        </button>
      </div>

      <div className='container'>
        {cards.map((card, index) => (
          <div key={card.id || index} className='admin-container'>
            <h3>Card {index + 1}</h3>

            <form className='form'>
              <p className='image-name'> Selected Image : {card.logoName}</p>

              <input type="file" accept="image/*"
                onChange={(e) => handleFileChange(e, card.id || index, "logo", "logoName")} />

              <input
                type='text'
                placeholder='Enter title'
                value={card.title}
                onChange={(e) => handleCardChange(card.id || index, "title", e.target.value)}
              />

              <input
                type="text"
                placeholder='Enter description'
                value={card.description}
                onChange={(e) => handleCardChange(card.id || index, "description", e.target.value)}
              />

              <input
                type="color"
                value={card.color}
                onChange={(e) => handleCardChange(card.id || index, "color", e.target.value)}
              />

              <div className='active-checkbox'>
                <label>Active:</label>
                <input
                  type="checkbox"
                  checked={card.active !== false}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    if (card.id) {
                      axios.put(`${API_URL}/${card.id}`, { ...card, active: newValue })
                        .then(() => setCards(prev => prev.map(c => c.id === card.id ? { ...c, active: newValue } : c)))
                    } else {
                      handleCardChange(index, "active", newValue)
                    }
                  }}
                />
              </div>

              <input type="file" accept="image/*"
                onChange={(e) => handleFileChange(e, card.id || index, "image", "imageName")} />
              <p className='image-name'>Selected Image : {card.imageName}</p>

            </form>

            <div className='actions'>
              <button 
                onClick={() => handleSave(card)} 
                className='saveBtn'
              >
                {card.id ? 'Save' : 'Add'}
              </button>
              {card.id && (
                <button 
                  onClick={() => handleDelete(card.id)}
                  className='delete'
                >
                  Delete
                </button>
              )}
            </div>

          </div>
        ))}

      </div>

    </>
  )
}

export default AdminPage
