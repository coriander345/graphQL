import React from 'react'
import './categoryCards.scss'
import { useStore, useStoreInterface } from '../../App'
import {useNavigate} from 'react-router-dom';


const CategoryCards = () => {
  
  const { categoryNames, isLast, categorys,questions } = useStore()
  const navigate = useNavigate();

  function handleCardClick(idx: number, keyword:string|undefined) {

    if (isLast) {
      fetch('http://localhost:8000/graphql/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          {
            questions{
              id
              question
              categoryId
              answers {
                id
                data
              }
            }
          }
          `
        })
        })
        .then(res => res.json())
        .then(data => {
          console.log('newData:', data.data.questions, idx)

          const newData = data.data.questions.filter((question: any) => +question.categoryId[0] === idx)
          console.log('newData:', data.data.questions[0].categoryId[0])
          useStore.setState({ questions: [...newData] })
        })
        console.log('questions: ',questions)
        navigate(`/card/${idx}`)
      
        

    } else {
      // 아래 last를 넣은 것은 임시방편 후에 categoryType에서 뽑아와야 한다.
      const filteredCate = categorys.filter((category) =>
        category.categoryType.split(' ')[0] === keyword
        &&  category.categoryType.split(' ')[1] === 'last'
      )


      const nameData = filteredCate.map((el: {
        name: string,
        categoryType: string,
        id: number,
      }) => {
        if (el.categoryType.split(' ')[1] === 'last') {
          useStore.setState({ isLast: true })

        }
        
        return { name: el.name, keyword: el.categoryType.split(' ')[0], id: el.id }
      })
      navigate(`/category/${keyword}`)
      useStore.setState({ categoryNames: [...nameData] })
    }
    
    
  }

  return (
    <div className='category_cards_box'> 
      {categoryNames.map((data, idx) => (
        <div key={idx} className='category_card' onClick={()=>handleCardClick(data.id, data.keyword)}>
          <span>
          {data.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CategoryCards
