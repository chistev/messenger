<script>
  import { createEventDispatcher } from 'svelte';

  // Define props and variables
  export let selectedUsers = [];
  const dispatch = createEventDispatcher();
  
  // State variable for currently selected user
  let currentSelectedUser = null;

  // Function to handle user selection
  function selectUser(user) {
    // Emit an event to notify the parent component
    dispatch('selectUser', user);
    
    // Update the URL
    history.pushState(null, '', `/messages/${user._id}`);
    
    // Update the currentSelectedUser state variable
    currentSelectedUser = user;
  }

  // On mount, check if there's a user ID in the URL and highlight the corresponding user
  import { onMount } from 'svelte';
  onMount(() => {
    const userId = window.location.pathname.split('/').pop();
    const userToHighlight = selectedUsers.find(user => user._id === userId);
    if (userToHighlight) {
      currentSelectedUser = userToHighlight;
    }
  });
</script>

<style>
  .form-control::placeholder {
    color: #e7e9ea;
    opacity: 1;
    font-weight: bold;
  }

  .direct-search-input-container {
    display: flex;
    align-items: center;
    border: 1px solid #35363a;
    border-radius: 25px;
    padding: 5px 15px;
    width: 100%;
  }

  .direct-search-input {
    background: transparent;
    border: none;
    color: #e7e9ea;
    flex-grow: 1;
    outline: none;
  }

  .direct-search-input:focus {
    background: transparent;
    box-shadow: none;
    color: #e7e9ea;
  }

  .direct-search-input::placeholder {
    color: #71767b;
    font-weight: 100;
  }

  /* Apply background color to selected user */
  .user-container.selected {
    background-color: #202327;
  }
</style>

<div id="selected-users" class="p-2" style="display: block;">
  <div class="p-2 mb-1">
    <div class="direct-search-input-container">
      <i class="bi bi-search me-2"></i>
      <input type="text" class="form-control direct-search-input" placeholder="Search Direct Messages">
    </div>
  </div>
  {#each selectedUsers as user}
    <div class="user-container d-flex align-items-center justify-content-between mb-3 p-2"
         class:selected={user === currentSelectedUser}
         style="background-color: {currentSelectedUser && currentSelectedUser._id === user._id ? '#202327' : 'transparent'};"
         on:click={() => selectUser(user)}>
      <div class="d-flex align-items-center">
        <div class="me-3">
          <img src="/user-img.png" alt={user.username} class="rounded-circle" style="width: 40px; height: 40px;">
        </div>
        <div>
          <span class="d-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 15px; line-height: 20px; color: #e7e9ea;">@{user.username}</span>
        </div>
      </div>
    </div>
  {/each}
</div>