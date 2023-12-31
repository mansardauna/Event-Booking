import React from 'react'
import { Link } from 'react-router-dom'
import { slider } from '../../components/ItemMap.tsx/banner'
import Header from './components/Header'
import Banner from './components/Nav/Banner'

const Home:React.FC=()=> {
  return (
<div>
  <Header />
  <Link to="/store">
  <div className="seeAll text-primary font-light w-11/12 text-right p-2">See all</div>
  <Banner slides={slider}/>
  </Link>
</div>
  )
}

export default Home