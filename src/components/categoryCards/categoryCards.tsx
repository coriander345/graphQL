import React from 'react'
import './categoryCards.scss'
import { useStore, useStoreInterface } from '../../App'
import {useNavigate} from 'react-router-dom';


const CategoryCards = () => {
  
  const { categorys } = useStore()
  const navigate = useNavigate();

  function handleCardClick() {
    navigate('/card/1')
  }

  return (
    <div className='category_cards_box'> 
      {categorys.map((category, idx) => (
        <div key={idx} className='category_card' onClick={handleCardClick}>
          <span>
          {category}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CategoryCards
