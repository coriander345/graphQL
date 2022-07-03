import React from 'react'
import CategoryCards from './categoryCards/categoryCards'
import {useStore, useStoreInterface} from '../App'
interface Props {
  count: number;
}
const Home = (props: Props) => {
  const {count} = props
  return (
    <div>
      <CategoryCards/>
    </div>
  )
}

export default Home
