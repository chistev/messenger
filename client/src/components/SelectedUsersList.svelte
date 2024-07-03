<script>
  import { onMount } from 'svelte';
  export let selectedUsers = [];
  let currentPopover = null; // Track currently open popover

  function activatePopover(event) {
    // Close current popover if one is open
    if (currentPopover) {
      currentPopover.dispose(); // Dispose the current popover instance
      currentPopover = null; // Clear the reference
    }

    // Delay popover initialization until after Svelte updates DOM
    setTimeout(() => {
      const popover = new bootstrap.Popover(event.target, {
        container: 'body',
        placement: 'right',
        html: true,
        content: `
          <div>
            <ul class="list-unstyled mb-0">
              <li class="p-2"><i class="bi bi-pin me-2"></i> Pin conversation</li>
              <li class="p-2"><i class="bi bi-bell-slash me-2"></i> Snooze conversation</li>
              <li class="p-2"><i class="bi bi-flag me-2"></i> Report conversation</li>
              <li class="p-2 text-danger"><i class="bi bi-trash me-2"></i> Delete conversation</li>
            </ul>
          </div>
        `
      });

      // Show popover
      popover.show();

      // Assign current popover instance
      currentPopover = popover;

      // Handle outside clicks to close popover
      function handleOutsideClick(event) {
        if (!popover._element.contains(event.target) && !event.target.closest('.bi-three-dots')) {
          popover.dispose();
          currentPopover = null;
          document.removeEventListener('click', handleOutsideClick);
        }
      }

      document.addEventListener('click', handleOutsideClick);
    }, 0); // Use a small delay to ensure Svelte updates DOM first
  }

  function selectUser(userId, username) {
    // Handle user selection logic
    console.log(`Selected user: ${username} (ID: ${userId})`);
  }

  // Fetch selected users or any initialization logic
  onMount(async () => {
    // Fetch selected users or perform any initialization logic
  });
</script>

<style>
  /* Logout */
  .sign-in-btn {
      transition: background-color 0.3s, color 0.3s;
  }

  .sign-in-btn:hover {
      background-color: rgba(29, 155, 240, 0.1);
  }

  /* Select Username */
  .submit-button {
      background-color: transparent;
      color: white;
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-radius: 50px;
      cursor: pointer;
      width: 80%;
      transition: background-color 0.3s ease;
  }

  .submit-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
  }

  .input-error {
      border-color: #f4212e !important;
  }

  /* Messages */
  .border-right {
      border-right: 1px solid #2f3336;
      border-left: 1px solid #2f3336;
  }

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
      color: #e7e9ea;;
  }

  .direct-search-input::placeholder {
      color: #71767b;
      font-weight: 100;
  }

  .three-dots-icon-container {
      cursor: pointer;
  }

  .user-container .three-dots-icon-container {
      display: none;
  }

  .user-container:hover .three-dots-icon-container {
      display: block;
  }

  .three-dots-custom-modal-dialog {
      max-width: fit-content;
      margin: auto;
  }

  .custom-popover {
      background-color: #202327;
      color: #e7e9ea;
      border-radius: 0.5rem;
  }

  .custom-popover .popover-arrow::before {
      background-color: #202327;
  }

  .custom-popover .custom-popover-content {
      color: #e7e9ea;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      font-weight: 700; 
      font-size: 15px; 
      line-height: 20px; 
      color: #e7e9ea;
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
    <div class="user-container d-flex align-items-center justify-content-between mb-3 p-2" style="background-color:#202327;">
      <div class="d-flex align-items-center">
        <div class="me-3">
          <img src="/user-img.png" alt={user.username} class="rounded-circle" style="width: 40px; height: 40px;">
        </div>
        <div>
          <span class="d-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 500; font-size: 15px; line-height: 20px; color: #e7e9ea;">@{user.username}</span>
        </div>
      </div>
      <div class="three-dots-icon-container text-white">
        <!-- Trigger popover on click -->
        <i class="bi bi-three-dots" data-bs-toggle="popover" on:click={activatePopover}></i>
      </div>
    </div>
  {/each}
</div>
