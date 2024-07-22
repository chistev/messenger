<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import UserList from './UserList.svelte';
  import { getJwtToken } from '../utils/utils';

  export let selectedUsers = [];
  const dispatch = createEventDispatcher();
  let currentSelectedUser = null;
  let socket;

  function selectUser(event) {
    const user = event.detail;
    console.log('User selected:', user);
    dispatch('selectUser', user);
    currentSelectedUser = user;
  }

  onMount(() => {
    console.log('Component mounted');
    socket = new WebSocket('wss://messenger-tu85.onrender.com');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      fetchSelectedUsers();
    };

    socket.onmessage = async (event) => {
      console.log('Received WebSocket message:', event.data);

      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const data = JSON.parse(reader.result);
            console.log('Parsed WebSocket message from Blob:', data);
            handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing JSON from WebSocket message Blob:', error);
          }
        };
        reader.readAsText(event.data);
      } else {
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket message from text:', data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing JSON from WebSocket message text:', error);
        }
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  });

  function handleWebSocketMessage(data) {
    console.log('Handling WebSocket message:', data);
    if (data.action === 'updateSelectedUsers') {
      fetchSelectedUsers();
    } else if (data.content && data.sender) {
      updateSelectedUsersOnMessage(data.sender, data.content);
      fetchSelectedUsers();
    } else {
      console.warn('Unknown message received from WebSocket:', data);
    }
  }

  async function fetchSelectedUsers() {
    console.log('Fetching selected users');
    try {
      const jwtToken = getJwtToken();
      const response = await fetch('https://messenger-tu85.onrender.com/api/selected-users', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch selected users');
      }
      const data = await response.json();
      selectedUsers = data.selectedUsers;
      console.log('Selected users fetched:', selectedUsers);
    } catch (error) {
      console.error('Error fetching selected users:', error);
    }
  }

  function updateSelectedUsersOnMessage(senderId, message) {
    console.log('Updating selected users with message:', { senderId, message });
    const index = selectedUsers.findIndex(user => user._id === senderId);
    if (index !== -1) {
      selectedUsers[index].lastMessage = message; // Update last message
      const user = selectedUsers.splice(index, 1)[0];
      selectedUsers = [user, ...selectedUsers];
      console.log('Updated selected users list:', selectedUsers);
    } else {
      console.log('Sender not found in selected users:', senderId);
    }
  }

  onMount(() => {
    console.log('Highlighting user on mount');
    const userId = window.location.pathname.split('/').pop();
    console.log('User ID from URL:', userId);
    const userToHighlight = selectedUsers.find(user => user._id === userId);
    if (userToHighlight) {
      currentSelectedUser = userToHighlight;
      console.log('User to highlight found:', userToHighlight);
    } else {
      console.log('User to highlight not found:', userId);
    }
  });
</script>


<style>
  #selected-users {
    max-height: 70vh; 
    overflow-y: auto;
  }
</style>

<div id="selected-users">  
    <UserList {selectedUsers} {currentSelectedUser} on:selectUser={selectUser}/>
</div>
