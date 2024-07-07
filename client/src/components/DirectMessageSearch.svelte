<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // State variables
  let searchInput = '';
  let isInputFocused = false;
  let isBackIconVisible = false;

  // Function to handle user search
  function handleSearch(event) {
    searchInput = event.target.value.trim();
    // You can implement search logic here if needed
  }

  // Function to handle input focus
  function handleFocus() {
    isInputFocused = true;
    isBackIconVisible = true; // Show the back icon when input is focused
    dispatch('focus'); // Notify parent component
  }

  // Function to handle input blur
  function handleBlur() {
    isInputFocused = false;
    // Keep isBackIconVisible true to keep the back icon visible
  }

  // Function to handle back button click
  function handleBackClick() {
    isInputFocused = false;
    isBackIconVisible = false; // Hide the back icon
    dispatch('back'); // Notify parent component to render UserList
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
    border: 1px solid #35363a; /* Default border color */
    border-radius: 25px;
    padding: 5px 15px;
    width: 100%;
    transition: border-color 0.3s ease; /* Add transition for smooth effect */
  }

  .direct-search-input-container:focus-within {
    border: 2px solid #1d9bf0; /* Change border color when input or container is focused */
    caret-color: #1d9bf0; /* Change cursor color to match border color */
  }

  .direct-search-input {
    background: transparent;
    border: none;
    color: #e7e9ea;
    flex-grow: 1;
    outline: none;
  }

  .direct-search-input:focus {
    box-shadow: none;
    border-color: transparent; /* Optionally hide input border when focused */
  }

  .direct-search-input::placeholder {
    color: #71767b;
    font-weight: 100;
  }

  .back-button {
    background: none;
    border: none;
    color: #cacdce;
    cursor: pointer;
    padding: 0;
    margin-right: 0.5rem;
    transition: color 0.3s ease;
  }

  .back-button:hover {
    color: #e7e9ea;
  }
</style>

<div class="p-2 mb-1">
  <div class="d-flex align-items-center">
    <div>
      <!-- Back button will show when input is focused and remain visible -->
      {#if isBackIconVisible}
        <button class="back-button" on:click={handleBackClick}>
          <i class="bi bi-arrow-left direct-search-icon fs-5"></i>
        </button>
      {/if}
    </div>
    <div class="direct-search-input-container">
      <i class="bi bi-search me-2"></i>
      <input
        type="text"
        class="form-control direct-search-input"
        bind:value={searchInput}
        placeholder="Search Direct Messages"
        on:input={handleSearch}
        on:focus={handleFocus}
        on:blur={handleBlur}
      />
    </div>
  </div>
</div>
