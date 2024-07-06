<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import ChatContent from "./ChatContent.svelte";

  export let currentChatUser;

  let newMessage = "";
  let messages = [];
  let previousUserId = "";
  let loggedInUserId = '';

  async function sendMessage(event) {
    event.preventDefault();
    if (newMessage.trim()) {
      const message = {
        content: newMessage,
        type: "sent",
        sender: loggedInUserId, // Set the sender field
        timestamp: new Date()
      };

      messages = [...messages, message];
      
      await saveMessage(message);

      newMessage = ""; // Clear the input field after sending
    }
  }

  async function saveMessage(message) {
    try {
      const response = await fetch(`/api/messages/${currentChatUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      console.log("Message sent and saved:", message); // Debugging statement
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  async function fetchMessages() {
    try {
      const response = await fetch(`/api/messages/${currentChatUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      messages = data.messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp)
      })); // Update messages with fetched data and convert timestamps to Date objects
      console.log(`Messages fetched for User ID: ${currentChatUser._id}`, messages); // Debugging statement
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  async function fetchLoggedInUserId() {
    try {
      const response = await fetch('/api/loggedInUserId');
      const data = await response.json();
      loggedInUserId = data.loggedInUserId;
    } catch (error) {
      console.error('Error fetching loggedInUserId:', error);
    }
  }

  beforeUpdate(() => {
    if (currentChatUser._id !== previousUserId) {
      fetchMessages();
      previousUserId = currentChatUser._id;
    }
  });

  onMount(() => {
    fetchMessages();
    fetchLoggedInUserId(); // Fetch the logged in user ID on component mount
  });

  afterUpdate(() => {
    // No longer needed for loading state management
  });
</script>

<style>
  .border-right {
    border-right: 1px solid #2f3336;
    border-left: 1px solid #2f3336;
  }

  .form-control::placeholder {
    color: #e7e9ea;
    opacity: 1;
    font-weight: bold;
  }
  
  .chat-body {
    overflow-y: auto;
    flex-grow: 1;
    padding-bottom: 60px; /* Height of the footer */
  }

  .chat-footer .input-container {
    display: flex;
    align-items: center;
    background-color: #202327;
    border-radius: 30px;
    width: 100%;
    padding: 5px;
  }

  .chat-footer .input-container textarea {
    background: transparent;
    border: none;
    color: #e7e9ea;
    box-shadow: none;
    resize: none;
    height: 40px;
    flex-grow: 1;
    min-width: 0;
    max-width: 100%;
    margin: 0 10px;
  }

  .chat-footer .input-container i {
    cursor: pointer;
  }
</style>

<div id="content-column" class="col-md-8 border-right d-flex flex-column p-3" style="position: relative; height: 100vh;">
  <div class="d-flex align-items-center mb-3">
    <img src="/user-img.png" alt="" class="rounded-circle" style="width: 40px; height: 40px;">
    <span class="username ms-2" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #e7e9ea;">{currentChatUser.username}</span>
  </div>
  <div class="chat-body mb-3 d-flex flex-column">
    <ChatContent {messages}/>
  </div>
  <div class="chat-footer d-flex align-items-center">
    <form class="input-container" on:submit={sendMessage}>
      <textarea bind:value={newMessage} class="form-control" placeholder="Start a new message"></textarea>
      <button type="submit" style="background: none; border: none; padding: 0;">
        <i class="bi bi-send text-primary me-3"></i>
      </button>
    </form>
  </div>
</div>
