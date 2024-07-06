<script>
    // Import necessary functions and dependencies
    import { createEventDispatcher } from 'svelte';
  
    // Define props and variables
    export let selectedUsers = [];
    const dispatch = createEventDispatcher();
  
    // State variable for search input value
    let searchInput = '';
  
    // Function to handle user search
    function handleSearch(event) {
      searchInput = event.target.value.trim();
      // You can implement search logic here if needed
    }
  
    // Function to handle user selection
    function selectUser(user) {
      // Emit an event to notify the parent component
      dispatch('selectUser', user);
  
      // Update the URL
      history.pushState(null, '', `/messages/${user._id}`);
    }
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
  </style>
  
  <div class="p-2 mb-1">
    <div class="direct-search-input-container">
      <i class="bi bi-search me-2"></i>
      <input type="text" class="form-control direct-search-input" bind:value={searchInput} placeholder="Search Direct Messages" on:input={handleSearch}>
    </div>
  </div>
  