<script>
  import { createEventDispatcher } from 'svelte';
  import { formatDistanceToNow, parseISO, format } from 'date-fns';

  export let selectedUsers = [];
  export let currentSelectedUser = null;
  const dispatch = createEventDispatcher();

  function selectUser(user) {
    dispatch('selectUser', user);
    
    history.pushState(null, '', `/messages/${user._id}`);
  }

  function truncateMessage(message, maxLength) {
    if (message.length > maxLength) {
      return message.slice(0, maxLength) + '...';
    }
    return message;
  }

  function formatTimestamp(timestamp) {
    const date = parseISO(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / 1000 / 60 / 60;

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM dd');
    }
  }
</script>

<style>
  .user-container {
    border: none;
    padding: 0;
    background-color: transparent;
    cursor: pointer; 
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px; 
    padding: 10px;
    width: 100%;
    text-align: left;
  }
  
  .user-container.selected {
    background-color: #202327; 
  }
  
  .user-container:focus {
    outline: none; 
  }
  
  .user-container img {
    width: 40px;
    height: 40px;
    border-radius: 50%; 
  }
  </style>
  
{#each selectedUsers as user}
  <button
    class="user-container d-flex align-items-center justify-content-between mb-3 p-2"
    class:selected={user === currentSelectedUser}
    style="background-color: {currentSelectedUser && currentSelectedUser._id === user._id ? '#202327' : 'transparent'};"
    on:click={() => selectUser(user)}
    on:keydown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        selectUser(user);
      }
    }}
    tabindex="0"
  >
    <div class="d-flex align-items-center">
      <div class="me-3">
        <img src="/user-img.png" alt={user.username} class="rounded-circle" style="width: 40px; height: 40px;">
      </div>
      <div>
        <div>
          <span class="d-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 15px; line-height: 20px; color: #e7e9ea;">@{user.username}</span>
        </div>
        
        <span class="d-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">
          {truncateMessage(user.lastMessage || '', 30)}
        </span>
        <span class="d-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">
          {user.lastMessageTimestamp ? formatTimestamp(user.lastMessageTimestamp) : ''}
        </span>
      </div>
    </div>
  </button>
{/each}
