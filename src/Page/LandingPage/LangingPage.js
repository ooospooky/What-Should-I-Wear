import './LandingPage.scss'

import React, { useState } from 'react'
import { Player} from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom'

import salesman from '../../Assets/animation/salesman.json'
//Lottie animation: https://lottiefiles.com/99745-sales-man
import landingpageMan from '../../Assets/animation/landingpageMan.json'
//Lottie animation: https://lottiefiles.com/97387-digital-designer

function LangingPage() {
  const containerStyle = {
    '--view-height': `${window.innerHeight}px`  //Style variable to set the view height dynamically
  };
  const [showTransition, setShowTransition] = useState(false) // State to control the transition animation visibility
  const navigate = useNavigate(); // Navigation function from react-router-dom
  const handleClick = () => {
    setShowTransition(prev => !prev) // Toggle the showTransition state
    setTimeout(() => { navigate('/home') }, 700) // Delay navigation to '/home' after 700ms
  }
  return (

    <div className='landingPage' style={containerStyle}>
      <div className="landingPage__container">
        {showTransition ? <div className='transitionDiv'>
          <Player
            className='transitionAnimation'
            autoplay
            loop
            src={salesman}
            style={{ height: '500px', width: '500px' }}
          />
        </div> : null}
        <div className='left' style={showTransition ? { display: 'none' } : {}}>
          {/* Alleviate Your Worries: Dress Suggestions for Any Weather */}
          {/* Ease Your Concerns: Outfit Recommendations for Any Weather */}
          {/* Weather-Based Dress Suggestions, Prepare for Every Day */}
          <h1 className='left__h1'>Alleviate Your Worries: Dress Suggestions for Any Weather</h1>
          <h3 className='left__h3'>Whether you're heading to work, going out for activities, our service provides accurate weather-based dress suggestions to help you effortlessly adapt to different climate conditions. Forget the hassle of deciding what to wear!</h3>
          {/* Experience our service now. */}
          <button onClick={() => { handleClick() }} className='left__btn'>Get started</button>
        </div>
        <div className='right' style={showTransition ? { display: 'none' } : {}}>
          <Player
            className='right__landingAnimation'
            autoplay
            loop
            src={landingpageMan}
          // src="https://assets2.lottiefiles.com/private_files/lf30_ecnepkno.json"
          />
        </div>
      </div>
    </div>
  )
}

export default LangingPage