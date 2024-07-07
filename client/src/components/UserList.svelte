<script>
    import { createEventDispatcher } from 'svelte';
  
    // Define props and variables
    export let selectedUsers = [];
    export let currentSelectedUser = null;
    const dispatch = createEventDispatcher();
  
    // Function to handle user selection
    function selectUser(user) {
      // Emit an event to notify the parent component
      dispatch('selectUser', user);
      
      // Update the URL
      history.pushState(null, '', `/messages/${user._id}`);
    }
  </script>
  
  <style>
    .user-container.selected {
      background-color: #202327;
    }
  </style>
  
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
  