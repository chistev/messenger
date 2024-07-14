<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import UserList from './UserList.svelte';

  export let selectedUsers = [];
  const dispatch = createEventDispatcher();
  let currentSelectedUser = null;
  let isInputFocused = false;
  let socket;

  function selectUser(event) {
    const user = event.detail;
    dispatch('selectUser', user);
    currentSelectedUser = user;
  }

  function handleFocus() {
    isInputFocused = true;
  }

  function handleBack() {
    isInputFocused = false;
  }

  onMount(() => {
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      fetchSelectedUsers();
    };

    socket.onmessage = async (event) => {

      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
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
  });

  function handleWebSocketMessage(data) {
    if (data.action === 'updateSelectedUsers') {
      fetchSelectedUsers();
    } else if (data.content && data.sender) {
      updateSelectedUsersOnMessage(data.sender, data.content);
      fetchSelectedUsers();
    } else {
      console.warn("Unknown message received from WebSocket:", data);
    }
  }

  async function fetchSelectedUsers() {
    try {
      const response = await fetch('/api/selected-users');
      if (!response.ok) {
        throw new Error('Failed to fetch selected users');
      }
      const data = await response.json();
      selectedUsers = data.selectedUsers;
    } catch (error) {
      console.error('Error fetching selected users:', error);
    }
  }

  function updateSelectedUsersOnMessage(senderId, message) {
    const index = selectedUsers.findIndex(user => user._id === senderId);
    if (index !== -1) {
      selectedUsers[index].lastMessage = message; // Update last message
      const user = selectedUsers.splice(index, 1)[0];
      selectedUsers = [user, ...selectedUsers];
    } else {
      console.log('Sender not found in selected users:', senderId);
    }
  }

  onMount(() => {
    const userId = window.location.pathname.split('/').pop();
    const userToHighlight = selectedUsers.find(user => user._id === userId);
    if (userToHighlight) {
      currentSelectedUser = userToHighlight;
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
