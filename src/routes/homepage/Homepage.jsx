import './homepage.css'
import { Link } from 'react-router-dom'
const Homepage = () => {
    return (
    <div className="homepage">
        <img src="/orbital.png" alt ="" className = 'orbital'/>
        <div className="left">
        <h1>NeuroChat</h1>
        <h2>Supercharge productivity with the latest in LLM technology</h2>
        <h3>
            Wumpus Thinking Dancing Eating Sleeping Blurple
        </h3>
        <Link to="/dashboard">Get Started</Link>
    </div>
        <div className="right">
            <div className = 'imgContainer'>
                <div className="bgContainer">
                    <div className='bg'></div>
                </div>
                <img src="bot.png" alt="" className ='bot'/>
            </div>
        </div>
    </div>
    )
}

export default Homepage