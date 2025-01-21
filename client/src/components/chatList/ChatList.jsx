import './chatList.css'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const ChatList = () => {
    const queryClient = useQueryClient();
    
    const { isPending, error, data } = useQuery({
        queryKey: ['userChats'],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
                credentials: "include",
            }).then((res) =>
                res.json()),
    });

    const deleteMutation = useMutation({
        mutationFn: (chatId) => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userChats'] });
        },
    });

    const handleDelete = (e, chatId) => {
        e.preventDefault(); // Prevent navigation
        deleteMutation.mutate(chatId);
    };

    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to='dashboard'>Create a new Chat</Link>
            <Link to='/'>Explore NeuroChat</Link>
            <Link to='/'>Contact</Link>
            <hr/>
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
                {isPending 
                ? "Loading..." 
                : error 
                ? "Something went wrong" 
                : data?.map((chat) => (
                    <div className="chat-item" key={chat._id}>
                        <Link to={`/dashboard/chats/${chat._id}`}>
                            {chat.title}
                        </Link>
                        <button 
                            className="delete-btn"
                            onClick={(e) => handleDelete(e, chat._id)}
                        >
                            <img src="/trash.png" alt="Delete" />
                        </button>
                    </div>
                ))}
            </div>
            <hr/>
            <div className='upgrade'>
                <img src='/logo.png' alt=''/>
                <div className='texts'>
                    <span>Upgrade to NeuroChat Pro(not actually a thing)</span>
                    <span>Unlimited access to all features!</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList;