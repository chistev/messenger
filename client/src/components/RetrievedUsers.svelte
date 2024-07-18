<script>
  import { createEventDispatcher } from 'svelte';
  
  export let users = [];
  
  const dispatch = createEventDispatcher();
  
  async function selectUser(selectedUser) {
  try {
    const response = await fetch('https://messenger-tu85.onrender.com/api/select-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        selectedUserId: selectedUser._id,
      }),
    });

    if (!response.ok) {
      console.error('Network response was not ok:', response.status, response.statusText);
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    dispatch('selectUser', selectedUser);
  } catch (error) {
    console.error('Error selecting user:', error);
    // Handle error condition
  }
}

</script>

{#each users as user}
  <div class="user-result d-flex align-items-center mb-3">
    <a href="#" class="me-3 user-link" data-username={user.username} data-user-id={user._id} on:click={() => selectUser(user)}>
      <img src="/user-img.png" alt={user.username} class="rounded-circle" style="width: 40px; height: 40px;">
    </a>
    <a href="#" class="text-decoration-none text-white user-link" data-username={user.username} data-user-id={user._id} on:click={() => selectUser(user)}>
      <span class="d-block">{user.username}</span>
    </a>
  </div>
{/each}
