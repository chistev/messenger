<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getJwtToken } from '../utils/utils';

  export let messages = [];
  let messageContainer;
  let loggedInUserId = '';

  function scrollToBottom() {
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  onMount(() => {
    scrollToBottom();
    fetchLoggedInUserId();
  });

  afterUpdate(() => {
    scrollToBottom();
  });

  async function fetchLoggedInUserId() {
  try {
    const jwtToken = getJwtToken();
    const response = await fetch('https://messenger-tu85.onrender.com/api/loggedInUserId', {
      credentials: 'include',
      headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch logged in user ID');
    }
    const data = await response.json();
    loggedInUserId = data.loggedInUserId;
  } catch (error) {
    console.error('Error fetching loggedInUserId:', error);
  }
}

  function formatTimestamp(timestamp) {
    if (!timestamp || !(timestamp instanceof Date)) return '';
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getMessageType(message) {
    if (!loggedInUserId) return '';
    return message.sender === loggedInUserId ? 'sent' : 'received';
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
    white-space: pre-line;
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
    color: #cce7ff;
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

  .message-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
  }
</style>

<div class="message-container" bind:this={messageContainer}>
  {#each messages as message, index}
    {#if index === 0 || (index > 0 && messages[index - 1].timestamp?.toDateString() !== message.timestamp?.toDateString())}
      <div class="date-separator">{message.timestamp?.toLocaleDateString()}</div>
    {/if}
    <div class="message {getMessageType(message)}">
      <div>{@html message.content.replace(/\n/g, '<br>')}</div>
      <div class="timestamp">{formatTimestamp(message.timestamp)}</div>
    </div>
  {/each}
</div>
