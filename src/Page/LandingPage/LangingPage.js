import React,{useState} from 'react'
import './LandingPage.scss'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import {useNavigate} from 'react-router-dom'
import salesman from '../../Assets/animation/salesman.json' //https://lottiefiles.com/99745-sales-man
import landingpageMan from '../../Assets/animation/landingpageMan.json' //https://lottiefiles.com/97387-digital-designer
import logo from '../../Assets/img/logo.png'

function LangingPage() {
  const [showTransition, setShowTransition] = useState(false)
  const navigate = useNavigate();
  const handleClick=()=>{
    setShowTransition(prev => !prev)
    setTimeout(() => { navigate('/home') }, 700)
  }
  return (
    
    <div className='landingPage' style={{position:"relative"}}>
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
      
        {/* Alleviate Your Worries: Dress Suggestions for Any Weather */}
        {/* Ease Your Concerns: Outfit Recommendations for Any Weather */}
        {/* Weather-Based Dress Suggestions, Prepare for Every Day */}
        <h1 className='left__h1'>Alleviate Your Worries: Dress Suggestions for Any Weather</h1>
        <h3 className='left__h3'>Whether you're heading to work, going out for activities, our service provides accurate weather-based dress suggestions to help you effortlessly adapt to different climate conditions. Forget the hassle of deciding what to wear!</h3>
        {/* Experience our service now. */}
        <button  onClick={()=>{handleClick()}} className='left__btn'>Get started</button>
      </div>
      <div className='right' style={showTransition ? { display: 'none' } : {}}>
      <Player
    className='landingAnimation'
    autoplay
    loop
    src={landingpageMan}
    // src="https://assets2.lottiefiles.com/private_files/lf30_ecnepkno.json"
    style={{ height: '500px', width: '500px' }}
  />
      </div>
    </div>
  )
}

export default LangingPage