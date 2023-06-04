import React, { useState } from 'react'
// import './LandingPage.scss'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom'
import salesman from '../../Assets/animation/salesman.json' //https://lottiefiles.com/99745-sales-man
import landingpageMan from '../../Assets/animation/landingpageMan.json' //https://lottiefiles.com/97387-digital-designer
import logo from '../../Assets/img/logo.png'
//min-width lg means when width larger then 1024px
function LangingPage() {
  const [showTransition, setShowTransition] = useState(false)
  const navigate = useNavigate();
  const handleClick = () => {
    setShowTransition(prev => !prev)
    setTimeout(() => { navigate('/home') }, 700)
  }
  return (

    <div className='landingPage' class="w-screen h-screen bg-langingPageBgc" style={{ position: "relative" }}>
      <div className="landingPage__container" class="p-16 flex justify-center items-center 
      lg:p8 " >
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
        <div className='left' class="w-6/12 text-white  " style={showTransition ? { display: 'none' } : {}}>

          {/* Alleviate Your Worries: Dress Suggestions for Any Weather */}
          {/* Ease Your Concerns: Outfit Recommendations for Any Weather */}
          {/* Weather-Based Dress Suggestions, Prepare for Every Day */}
          <h1 className='left__h1' class="text-5xl font-semibold mt-4 mb-4 lg:text-4xl lg:mt-2 lg:mb-6">Alleviate Your Worries: Dress Suggestions for Any Weather</h1>
          <h3 className='left__h3' class='text-3xl font-normal mb-6 lg:text-2xl' >Whether you're heading to work, going out for activities, our service provides accurate weather-based dress suggestions to help you effortlessly adapt to different climate conditions. Forget the hassle of deciding what to wear!</h3>
          {/* Experience our service now. */}
          <button onClick={() => { handleClick() }} className='left__btn' class="py-6 px-14 tracking-wide leading-4 text-xl font-medium bg-white rounded-lg text-[#105794] 
          border-none hover:bg-landingPageBtnHoverBcg" >Get started</button>
        </div>
        <div className='right' class="w-6/12" style={showTransition ? { display: 'none' } : {}}>
          <div class="h-[500px] w-[500px] flex justify-center items-center"> 
          {/* 在player裡面設置class沒有辦法變更大小 */}
          <Player
          // class="h-9 w-9"
            className='right__landingAnimation'
            autoplay
            loop
            src={landingpageMan}
            // src="https://assets2.lottiefiles.com/private_files/lf30_ecnepkno.json"
            // style={{ height: '500px', width: '500px' }}
          />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LangingPage