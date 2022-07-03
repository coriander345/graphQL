import { useEffect } from 'react'
import './App.css';
import create from 'zustand'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './components/home'
import Card from './components/card'

export interface useStoreInterface {
  count: number;
  categorys: string[];
  questions: string[];
}


export const useStore = create<useStoreInterface>(() => ({
  count: 0,
  categorys: [],
  questions:[],
}))





function App() {
  const {count,categorys} = useStore()

  useEffect(() => {
    fetch('http://localhost:8000/graphql/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          categorys{
            name
          }
        }
        `
      })
    }).then(res=>res.json())
      .then(data => {
        const newData = data.data.categorys.map((el: any) => el.name)

        useStore.setState({categorys : [...newData]})
    })
    
  }, [])

  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Home count={count}/>} />
          <Route path="/card/:id" element={<Card />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
