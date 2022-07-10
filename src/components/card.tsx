import {useStore} from '../App'

function Card() {
  const { count,questions } = useStore();
  
  

  return (
    <div className="card">
      {questions.map(data => (
        <div>
          <p>{data.question}</p>
        </div>
      ))}
       </div>
  )
}

export default Card