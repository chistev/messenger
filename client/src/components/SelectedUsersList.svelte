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
    console.log('Component mounted. Setting up WebSocket.');

    // WebSocket setup
    socket = new WebSocket('wss://messenger-tu85.onrender.com');

    socket.onopen = () => {
      console.log('WebSocket connection established.');
      fetchSelectedUsers();
    };

    socket.onmessage = async (event) => {
      console.log('WebSocket message received:', event);

      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
          console.log('WebSocket message as Blob read.');
          try {
            const data = JSON.parse(reader.result);
            handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing JSON from WebSocket message:', error);
          }
        };
        reader.readAsText(event.data);
      } else {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message as JSON:', data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing JSON from WebSocket message:', error);
        }
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    // Highlight user based on URL
    const userId = window.location.pathname.split('/').pop();
    console.log('User ID from URL:', userId);
    const userToHighlight = selectedUsers.find(user => user._id === userId);
    if (userToHighlight) {
      console.log('User to highlight:', userToHighlight);
      currentSelectedUser = userToHighlight;
    } else {
      console.log('User to highlight not found:', userId);
    }
  });

  function handleWebSocketMessage(data) {
    console.log('Handling WebSocket message:', data);
    if (data.action === 'updateSelectedUsers') {
      console.log('Update selected users action received.');
      fetchSelectedUsers();
    } else if (data.content && data.sender) {
      console.log('Message received from sender:', data.sender, 'Content:', data.content);
      updateSelectedUsersOnMessage(data.sender, data.content);
      fetchSelectedUsers();
    } else {
      console.warn("Unknown message received from WebSocket:", data);
    }
  }

  async function fetchSelectedUsers() {
    console.log('Fetching selected users.');
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
      console.log('Fetched selected users:', data);
      selectedUsers = data.selectedUsers;
    } catch (error) {
      console.error('Error fetching selected users:', error);
    }
  }

  function updateSelectedUsersOnMessage(senderId, message) {
    console.log('Updating selected users with message from sender:', senderId, 'Message:', message);
    const index = selectedUsers.findIndex(user => user._id === senderId);
    if (index !== -1) {
      selectedUsers[index].lastMessage = message; // Update last message
      const user = selectedUsers.splice(index, 1)[0];
      selectedUsers = [user, ...selectedUsers];
    } else {
      console.log('Sender not found in selected users:', senderId);
    }
  }
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