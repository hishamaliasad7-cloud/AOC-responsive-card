import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './AdminPage.css'

function AdminPage() {

  const { id } = useParams()
  const API_URL = '/features'

  const [cards, setCards] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState('')
  const [logoName, setLogoName] = useState('')
  const [image, setImage] = useState('')
  const [imageName, setImageName] = useState('')
  const [color, setColor] = useState('')
  const [active, setActive] = useState(true)

  const [addCard, setAddCard] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const fetchCards = async () => {
    try {
    const res = await axios.get(API_URL)
    setCards(res.data)
  } catch (error) {
    console.error('Error fetching cards:', error)
  }
}

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    if (id && cards.length > 0) {
      const card = cards.find(c => String(c.id) === String(id))
      if (card) fillForm(card)
    }
  }, [id, cards])

  const fillForm = (card) => {
    setTitle(card.title)
    setDescription(card.description)
    setLogo(card.logo)
    setLogoName(card.logoName || '')
    setImage(card.image)
    setImageName(card.imageName || '')
    setColor(card.color)
    setActive(card.active !== false)
    setEditingId(card.id)
    setAddCard(true)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setLogo('')
    setLogoName('')
    setImage('')
    setImageName('')
    setColor('')
    setActive(true)
    setEditingId(null)
    setAddCard(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description) {

      return
    }

    const data = {
      title,
      description,
      logo,
      logoName,
      image,
      imageName,
      color,
      active
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data)
      } else {
        await axios.post(API_URL, data)
      }

      resetForm()
      fetchCards()

    } catch (error) {
      console.log('Submit error:', error.message)
    }
  }

  const handleFileChange = (e, setValue, setName) => {
    const file = e.target.files[0]
    if (!file) return

    setName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => setValue(reader.result)
    reader.readAsDataURL(file)
  }

  const handleCardChange = (id, field, value) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, [field]: value } : card
      )
    )
  }

  const handleCardImageChange = (e, id, field) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setCards(card =>
        card.id === id
          ? { ...card, [field]: reader.result, [`${field}Name`]: file.name }
          : card
      )

    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (card) => {
    try {
      await axios.put(`${API_URL}/${card.id}`, card)
      fetchCards()
    } catch (error) {
      console.log('Save error:', error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchCards()
      if (editingId === id) resetForm()
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

            <form className='form' onSubmit={(e) => e.preventDefault()}>
              <p className='image-name'> Selected Image : {card.logoName}</p>

              <input type="file" accept="image/*"
                onChange={(e) => handleCardImageChange(e, card.id, 'logo')} />

              <input
                type='text'
                value={card.title}
                onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
              />

              <input
                type="text"
                value={card.description}
                onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
              />

              <input
                type="color"
                value={card.color}
                onChange={(e) => handleCardChange(card.id, 'color', e.target.value)}
              />

              <div className='active-checkbox'>
                <label>Active:</label>
                <input
                  type="checkbox"
                  checked={card.active !== false}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    axios.put(`${API_URL}/${card.id}`, { ...card, active: newValue })
                      .then(() => fetchCards())
                  }}
                />
              </div>

              <input type="file" accept="image/*"
                onChange={(e) => handleCardImageChange(e, card.id, 'image')} />
              <p className='image-name'>Selected Image : {card.imageName}</p>

            </form>

            <div className='actions'>
              <button onClick={() => handleDelete(card.id)}>Delete</button>
            </div>

          </div>
        ))}

        {addCard && (
          <div className='admin-container add-card-inline'>

            <h3>{editingId ? 'Update Card' : 'New Card'}</h3>

            <form onSubmit={handleSubmit} className='form'>

              <input type="file" accept="image/*"
                onChange={(e) => handleFileChange(e, setLogo, setLogoName)} />

              <input
                type='text'
                placeholder='Enter title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />

              <input type="file" accept="image/*"
                onChange={(e) => handleFileChange(e, setImage, setImageName)} />

              <div className="inline-actions">
                <button type="submit">
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      <div className='save-btn'>
        <button className="saveBtn" onClick={() => {
          cards.forEach(card => handleSave(card))
        }}>
          Save
        </button>
      </div>

    </>
  )
}

export default AdminPage
