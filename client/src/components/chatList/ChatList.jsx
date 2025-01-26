import './chatList.css'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'

const ChatList = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user chats
  const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: async () => {
      // Ensure the user is authenticated
      if (!isLoaded || !isSignedIn) {
        throw new Error('User is not authenticated');
      }

      // Retrieve the session token
      const sessionToken = await getToken();
      console.log('Session Token:', sessionToken);

      if (!sessionToken) {
        throw new Error('Failed to retrieve session token');
      }

      // Fetch user chats from the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user chats');
      }

      return response.json();
    },
  });

  // Delete a chat
  const deleteMutation = useMutation({
    mutationFn: async (chatId) => {
      // Ensure the user is authenticated
      if (!isLoaded || !isSignedIn) {
        throw new Error('User is not authenticated');
      }

      // Retrieve the session token
      const sessionToken = await getToken();
      console.log('Session Token:', sessionToken);

      if (!sessionToken) {
        throw new Error('Failed to retrieve session token');
      }

      // Send a DELETE request to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      return response;
    },
    onSuccess: () => {
      // Invalidate the user chats query to refetch data
      queryClient.invalidateQueries({ queryKey: ['userCh'] });
    },
  });



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