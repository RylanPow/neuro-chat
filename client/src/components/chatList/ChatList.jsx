import './chatList.css'
import { Link } from 'react-router-dom'

const  ChatList = () => {
    return (
        <div className = 'chatList'>
        <span className = 'title'>DASHBOARD</span>
        <Link to = 'dashboard'>Create a new Chat</Link>
        <Link to = '/'>Explore NeuroChat</Link>
        <Link to = '/'>Contact</Link>
        <hr/>
        <span className ='title'>RECENT CHATS</span>
        <div className='list'>
            <Link to='/'>My Chat Title</Link>
            <Link to='/'>My Chat Title</Link>
            <Link to='/'>My Chat Title</Link>
            <Link to='/'>My Chat Title</Link>
            <Link to='/'>My Chat Title</Link>
            <Link to='/'>My Chat Title</Link>
            <Link to='/'>My Chat Title</Link>
        </div>
        <hr/>
        <div className = 'upgrade'>
            <img src = '/logo.png' alt =''/>
                <div className = 'texts'>
                    <span>Upgrade to NeuroChat Pro(not actually a thing)</span>
                    <span>Unlimited access to all features!</span>
                </div>

         </div>
        </div>
    )
}

export default ChatList;