<script>
  export let selectedUsers = [];

  function selectUser(userId, username) {
    // Handle user selection logic
    console.log(`Selected user: ${username} (ID: ${userId})`);
  }
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
    <div class="user-container d-flex align-items-center justify-content-between mb-3 p-2" style="background-color:#202327;" on:click={() => selectUser(user._id, user.username)} data-user-id={user._id}>
      <div class="d-flex align-items-center">
        <div class="me-3">
          <img src="data:image/png;base64,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" alt={user.username} class="rounded-circle" style="width: 40px; height: 40px;">
        </div>
        <div>
          <span class="d-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 500; font-size: 15px; line-height: 20px; color: #e7e9ea;">@{user.username}</span>
        </div>
      </div>
      <div class="three-dots-icon-container text-white">
        <i class="bi bi-three-dots" data-bs-toggle="popover"></i>
      </div>
    </div>
  {/each}
</div>
