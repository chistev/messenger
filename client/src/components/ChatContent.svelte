<script>
    import { onMount, afterUpdate } from 'svelte';
  
    export let messages = [];
  
    let messageContainer;
  
    // Function to scroll to the bottom of the message container
    function scrollToBottom() {
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  
    // Scroll to the bottom when the component mounts
    onMount(() => {
      scrollToBottom();
    });
  
    // Watch for changes to the messages array and scroll to bottom after update
    afterUpdate(() => {
      scrollToBottom();
    });
  
    // Function to format timestamp to HH:mm (hours and minutes)
    function formatTimestamp(timestamp) {
      if (!timestamp) return ''; // Handle undefined case
      return new Date(timestamp).toLocaleDateString();
    }
  </script>  
  <style>
    .message {
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 5px;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-weight: 400;
      font-size: 15px;
      line-height: 20px;
      white-space: pre-line; /* Ensures newlines are respected */
      max-width: 60%;
    }
  
    .message.sent {
      background-color: #1d9bf0;
      align-self: flex-end;
      text-align: left;
    }
  
    .message.received {
      background-color: #2f3336;
      color: #e7e9ea;
      align-self: flex-start;
    }
  
    .timestamp {
      font-size: 0.8rem;
      color: #71767b;
      margin-top: 2px;
    }
  
    .message.sent .timestamp {
      color: #cce7ff; /* Change this color to something that contrasts well with the sent message background */
    }
  
    .date-separator {
      text-align: center;
      color: #71767b;
      font-size: 0.9rem;
      margin: 10px 0;
      position: relative;
    }
  
    .date-separator::before,
    .date-separator::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background-color: #71767b;
    }
  
    .date-separator::before {
      left: 0;
    }
  
    .date-separator::after {
      right: 0;
    }
  
    /* Container to hold the messages and handle scrolling */
    .message-container {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      height: 100%; /* Adjust this as needed */
    }
  </style>
  
  <div class="message-container" bind:this={messageContainer}>
    {#each messages as message, index}
      {#if index === 0 || (index > 0 && messages[index - 1].timestamp?.toDateString() !== message.timestamp?.toDateString())}
        <div class="date-separator">{message.timestamp?.toLocaleDateString()}</div>
      {/if}
      <div class="message {message.type}">
        <div>{@html message.content.replace(/\n/g, '<br>')}</div>
        <div class="timestamp">{formatTimestamp(message.timestamp)}</div>
      </div>
    {/each}
  </div>