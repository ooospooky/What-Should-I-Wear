import React,{useState} from 'react'
import './LandingPage.scss'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import {useNavigate} from 'react-router-dom'
import salesman from '../../Assets/animation/salesman.json'

function LangingPage() {
  const [showTransition, setShowTransition] = useState(false)
  const navigate = useNavigate();
  const handleClick=()=>{
    setShowTransition(prev => !prev)
    setTimeout(() => { navigate('/home') }, 700)
  }
  return (
    
    <div className='landingPage'>
         {showTransition ? <div style={{ height: '100vh', width: '100vw', background: "linear-gradient(141.11deg, rgba(7, 51, 88, 0.4) 9.39%, #073358 70.4%)" }}>
        <Player
          className='transitionAnimation'
          autoplay
          // speed={2}
          loop
          src={salesman}
          style={{ height: '500px', width: '500px' }}
        />
      </div> : <></>}
      <div className='left' style={showTransition ? { display: 'none' } : {}}>
        <h1 className='left__h1'>Make your app the best it can be</h1>
        <h3 className='left__h3'>Firebase is an app development platform that helps you build and grow apps  and games users love. Backed by Google and trusted by millions of businesses around the world.</h3>
        <button  onClick={()=>{handleClick()}} className='left__btn'>Get started</button>
      </div>
      <div className='right' style={showTransition ? { display: 'none' } : {}}>
      <Player
    className='landingAnimation'
    autoplay
    direction= "-1"
    loop
    src="https://assets2.lottiefiles.com/private_files/lf30_ecnepkno.json"
    style={{ height: '500px', width: '500px' }}
  />
      </div>
    </div>
  )
}

export default LangingPage