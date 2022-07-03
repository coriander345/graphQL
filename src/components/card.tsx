import {useStore} from '../App'
import { useParams } from "react-router-dom";

function Card() {
  const { count,questions } = useStore();
  const { id } = useParams()
  
  console.log(id)

  function handleGetData(){
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
    }).then(res=>res.json())
      .then(data => {
        console.log(data.data)
        const newData = data.data.questions.filter((question:any) => question.categoryId === id)
        useStore.setState({ questions: [...newData]})
    })
  }


  return (
    <div className="card">
      {questions.map(question => (
        <div>
          <p>{question} {count}</p>
        </div>
      ))}
      
      <button onClick={handleGetData}>data</button>
    </div>
  )
}

export default Card