import axios from 'axios'
import React, { useState, useEffect } from 'react'


import './AdminPage.css'

function AdminPage() {
  const API_URL = 'http://192.168.1.92:3000/features'
  const [cards, setCards] = useState([])
  const [addCard, setAddCard] = useState(false)
  const [editCardId, setEditCardId] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    logo: "",
    color: "",
    image: "",
    active: true,
    logoName: "",
    imageName: ""
  })


  const fetchCards = async () => {
    const res = await axios.get(API_URL)
    setCards(res.data)
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      logo: "",
      color: "",
      image: "",
      active: true,
      logoName: "",
      imageName: ""
    })
    setAddCard(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(API_URL, formData)
      resetForm()

      setCards(prev => [...prev, formData])
    }
    catch (error) {
      console.log('Submit error:', error.message)
    }
  }


  const handleFileChange = (e, field, nameField) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, [field]: reader.result, [nameField]: file.name }))
    reader.readAsDataURL(file)
  }

  const handleCardChange = (id, field, value) => {
    setEditCardId(id)
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, [field]: value } : card
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
      const res = await axios.put(`${API_URL}/${card.id}`, card)
      setCards((prev) => prev.map(c => c.id === card.id ? res.data : c))
      setEditCardId(null)
      console.log(res.data)
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
      <div className='nav'>
        <h1 className='heading'>All Cards</h1>
        <button
          className='add-button'
          onClick={() => setAddCard(prev => !prev)}
        >
          {addCard ? 'Close Form' : 'Add a Card'}
        </button>
      </div>

      <div className='container'>

        {cards.map((card, index) => (
          <div key={card.id} className='admin-container'>

            <h3>Card {index + 1}</h3>

            <form className='form' onSubmit={handleSubmit}>
              <p className='image-name'> Selected Image : {card.logoName}</p>

              <input type="file" accept="image/*"
                onChange={(e) => handleCardImageChange(e, card.id, "logo")} />

              <input
                type='text'
                value={card.title}
                onChange={(e) => handleCardChange(card.id, "title", e.target.value)}
              />

              <input
                type="text"
                value={card.description}
                onChange={(e) => handleCardChange(card.id, "description", e.target.value)}
              />

              <input
                type="color"
                value={card.color}
                onChange={(e) => handleCardChange(card.id, "color", e.target.value)}
              />

              <div className='active-checkbox'>
                <label>Active:</label>
                <input
                  type="checkbox"
                  checked={card.active !== false}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    axios.put(`${API_URL}/${card.id}`, { ...card, active: newValue })
                      .then(() => setCards(prev => prev.map(c => c.id === card.id ? { ...c, active: newValue } : c)))
                  }}
                />
              </div>

              <input type="file" accept="image/*"
                onChange={(e) => handleCardImageChange(e, card.id, "image")} />
              <p className='image-name'>Selected Image : {card.imageName}</p>

            </form>

            <div className='actions'>
              <button onClick={() => handleDelete(card.id)}>Delete</button>
            </div>

          </div>
        ))}

        {addCard && (
          <div className='admin-container add-card-inline'>

            <h3>New Card</h3>

            <form onSubmit={handleSubmit} className='form'>

              <input type="file" accept="image/*"
                onChange={(e) => handleFileChange(e, "logo", "logoName")} />

              <input
                type='text'
                placeholder='Enter title'
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <input
                type="text"
                placeholder='Enter description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })

                }
              />

              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />

              <input type="file" accept="image/*"
                onChange={(e) => handleFileChange(e, "image", "imageName")} />

              <div className="inline-actions">
                <button type="submit">
                  Add
                </button>

              </div>

            </form>
          </div>
        )}

      </div>

      <div className='save-btn'>
        <button className="saveBtn" onClick={() => {
          const card = cards.find(card => card.id === editCardId)
          if (card) {
            handleSave(card)
          }
        }}>
          Save
        </button>
      </div>

    </>
  )
}

export default AdminPage
