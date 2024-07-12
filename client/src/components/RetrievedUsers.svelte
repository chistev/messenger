<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    
    export let users = [];
    
    const dispatch = createEventDispatcher();
    
    async function selectUser(selectedUserId) {
      try {
        const response = await fetch('/api/select-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedUserId: selectedUserId,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        console.log('Successfully selected user:', data);
        dispatch('selectUser', selectedUserId); // Emit event to notify parent
      } catch (error) {
        console.error('Error selecting user:', error);
        // Handle error condition
      }
    }
  </script>
  
  {#each users as user}
    <div class="user-result d-flex align-items-center mb-3">
      <a href="#" class="me-3 user-link" data-username={user.username} data-user-id={user._id} on:click={() => selectUser(user._id)}>
        <img src="" alt={user.username} class="rounded-circle" style="width: 40px; height: 40px;">
      </a>
      <a href="#" class="text-decoration-none text-white user-link" data-username={user.username} data-user-id={user._id} on:click={() => selectUser(user._id)}>
        <span class="d-block">{user.username}</span>
      </a>
    </div>
  {/each}
  