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
import CategoryCards from './components/categoryCards/categoryCards';

export interface useStoreInterface {
  count: number;
  categorys: any[];
  categoryNames: any[];
  questions: any[];
  isLast: boolean;
}


export const useStore = create<useStoreInterface>(() => ({
  count: 0,
  categorys:[],
  categoryNames: [],
  questions: [],
  isLast:false,
}))





function App() {
  const {count,categorys,categoryNames} = useStore()

  useEffect(() => {
    fetch('http://localhost:8000/graphql/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          categorys{
            id
            name
            categoryType
          }
        }
        `
      })
    }).then(res=>res.json())
      .then(data => {
        const filteredData = data.data.categorys.filter((el: any) => el.categoryType.split(' ')[1] === 'first')
        const nameData = filteredData.map((el: {
          name: string,
          categoryType: string,
          id: number,
        }) => { return { name: el.name, keyword: el.categoryType.split(' ')[0], id: el.id } })
        
        useStore.setState({
          categoryNames: [...nameData],
          categorys: data.data.categorys
        })
    })
    
  }, [])

  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Home count={count}/>} />
          <Route path="/card/:id" element={<Card />} />
          <Route path="/category" element={<CategoryCards />} />
          <Route path="/category/:id" element={<CategoryCards />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
