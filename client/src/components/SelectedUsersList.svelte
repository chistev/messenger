<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import DirectMessageSearch from './DirectMessageSearch.svelte';
  import DefaultDirectMessageText from './DefaultDirectMessageText.svelte';
  import UserList from './UserList.svelte';

  // Define props and variables
  export let selectedUsers = [];
  const dispatch = createEventDispatcher();
  
  // State variables
  let currentSelectedUser = null;
  let isInputFocused = false;

  // Function to handle user selection
  function selectUser(event) {
    const user = event.detail;
    // Emit an event to notify the parent component
    dispatch('selectUser', user);
    
    // Update the currentSelectedUser state variable
    currentSelectedUser = user;
  }

  // Handle focus event from DirectMessageSearch
  function handleFocus() {
    isInputFocused = true;
  }

  // Handle back event from DirectMessageSearch
  function handleBack() {
    isInputFocused = false;
  }

  // On mount, check if there's a user ID in the URL and highlight the corresponding user
  onMount(() => {
    const userId = window.location.pathname.split('/').pop();
    const userToHighlight = selectedUsers.find(user => user._id === userId);
    if (userToHighlight) {
      currentSelectedUser = userToHighlight;
    }
  });
</script>

<div id="selected-users">
  <DirectMessageSearch on:focus={handleFocus} on:back={handleBack}/>
  
  {#if isInputFocused}
    <DefaultDirectMessageText/>
  {:else}
    <UserList {selectedUsers} {currentSelectedUser} on:selectUser={selectUser}/>
  {/if}
</div>
