<script>
    import Settings from '../../components/Settings.svelte';
    import MessageModal from '../../components/MessageModal.svelte';
    import SideBarWelcomeMessage from '../../components/SideBarWelcomeMessage.svelte';
    import SelectedUsersList from '../../components/SelectedUsersList.svelte';
    import Spinner from '../../components/Spinner.svelte';
    import ChatPanel from '../../components/ChatPanel.svelte';
    import { onMount } from 'svelte';

    let showSettings = false;
    let showMessageModal = false;
    let selectedUsers = [];
    let loading = true; // Add a loading state
    let currentChatUser = null; // Track the selected user for chat

    // Function to toggle settings component
    function toggleSettings() {
        showSettings = !showSettings;
        console.log('Toggle Settings Clicked. showSettings:', showSettings);
    }

    function toggleMessageModal() {
        showMessageModal = !showMessageModal;
        if (showMessageModal) {
            document.querySelector('.page-container').style.backgroundColor = '#242d34'; 
        } else {
            document.querySelector('.page-container').style.backgroundColor = '#000000'; // Revert to original color
        }
    }

    function closeMessageModal() {
        showMessageModal = false;
        document.querySelector('.page-container').style.backgroundColor = '#000000'; // Revert to original color
    }

    function handleUserSelection(event) {
        currentChatUser = event.detail; // Set the selected user for chat
    }

    onMount(async () => {
        try {
            const response = await fetch('/api/selected-users', {
                credentials: 'include'
            });
            const data = await response.json();
            selectedUsers = data.selectedUsers;
        } catch (err) {
            console.error('Failed to fetch selected users:', err);
        } finally {
            loading = false; // Set loading to false when the request is complete
        }
    });
</script>

<style>
    .border-right {
        border-right: 1px solid #2f3336;
        border-left: 1px solid #2f3336;
    }
</style>

<div class="page-container" style="background-color: #000000;">
    <div class="container-fluid min-vh-100 d-flex flex-column" style="width: 80%;">
        <div class="row flex-grow-1">
            <div class="col-md-4 border-right" id="sidebar-container">
                <div class="p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 20px; line-height: 24px; color: #e7e9ea;">
                            Messages
                        </h3>
                        <div class="fs-6 text-white">
                            <i style="cursor: pointer;" class="bi bi-gear me-3" on:click={toggleSettings} aria-label="Toggle Settings"></i>
                            <i class="bi bi-envelope-at" style="cursor: pointer;" on:click={toggleMessageModal} aria-label="Open Message Modal"></i>
                        </div>
                    </div>
                    {#if loading}
                        <Spinner size="3rem" /> <!-- Show spinner while loading -->
                    {:else} 
                        {#if selectedUsers.length === 0}
                            <SideBarWelcomeMessage on:writeMessage={toggleMessageModal} />
                        {:else}
                            <SelectedUsersList {selectedUsers} on:selectUser={handleUserSelection} />
                        {/if}
                    {/if}
                </div>
            </div>
            {#if showSettings}
                <Settings on:closeSettings={() => showSettings = false} />
            {:else if currentChatUser}
                <ChatPanel {currentChatUser} />
            {:else}
                <div id="content-column" class="col-md-8 border-right d-flex flex-column align-items-center justify-content-center">
                    <div class="p-3 text-center">
                        <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 31px; line-height: 36px; color: #e7e9ea;">
                            Select a message
                        </h3>
                        <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">
                            Choose from your existing conversations, or start a new one.
                        </p>
                        <button class="btn p-3" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #ffffff; background-color: #1d9bf0; border-radius: 50px;" on:click={toggleMessageModal}>
                            New message
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <MessageModal showModal={showMessageModal} on:closeModal={closeMessageModal} />
</div>
