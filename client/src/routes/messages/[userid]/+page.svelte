<script>
    import { onMount } from 'svelte';
    import { onDestroy } from 'svelte';
    import Spinner from '../../../components/Spinner.svelte';
    import ChatPanel from '../../../components/ChatPanel.svelte';
    import MessageModal from '../../../components/MessageModal.svelte';
    import SelectedUsersList from '../../../components/SelectedUsersList.svelte';
    import Settings from '../../../components/Settings.svelte';

    let showSettings = false;
    let showMessageModal = false;
    let selectedUsers = [];
    let loading = true;
    let currentChatUser = null;

    function toggleSettings() {
        showSettings = !showSettings;
    }

    function toggleMessageModal() {
        showMessageModal = !showMessageModal;
        document.querySelector('.page-container').style.backgroundColor = showMessageModal ? '#242d34' : '#000000';
    }

    function closeMessageModal() {
        showMessageModal = false;
        document.querySelector('.page-container').style.backgroundColor = '#000000';
    }

    function handleUserSelection(event) {
        currentChatUser = event.detail;
        history.pushState(null, '', `/messages/${currentChatUser._id}`);
    }

    async function fetchUserById(userId) {
        console.log("fetchUserById called with userId", userId);
        const response = await fetch(`/api/users/${userId}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        const user = await response.json();
        console.log("User fetched", user);
        return user;
    }

    onMount(async () => {
        const userId = window.location.pathname.split('/').pop(); 
        console.log("Current userId:", userId);
        try {
            const response = await fetch('/api/selected-users', {
                credentials: 'include'
            });
            const data = await response.json();
            selectedUsers = data.selectedUsers;
            console.log("Selected users fetched", selectedUsers); 

            if (userId) {
                currentChatUser = await fetchUserById(userId);
                console.log("currentChatUser set", currentChatUser); 
            }
        } catch (err) {
            console.error('Failed to fetch selected users:', err);
        } finally {
            loading = false;
        }
    });
</script>

<style>
    .border-right {
        border-right: 1px solid #2f3336;
        border-left: 1px solid #2f3336;
    }

    .fs-6 button {
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
    }

    .fs-6 button:focus {
        outline: none;
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
                            <button type="button" aria-label="Toggle Settings" on:click={toggleSettings}>
                                <i class="bi bi-gear me-3" style="cursor: pointer;"></i>
                            </button>

                            <button type="button" aria-label="Open Message Modal" on:click={toggleMessageModal}>
                                <i class="bi bi-envelope-at" style="cursor: pointer;"></i>
                            </button>
                        </div>
                    </div>
                    {#if loading}
                        <Spinner size="3rem" />
                    {:else}
                        <SelectedUsersList {selectedUsers} on:selectUser={handleUserSelection} />
                    {/if}
                </div>
            </div>
            {#if showSettings}
                <Settings on:closeSettings={() => showSettings = false} />
            {:else if currentChatUser}
                <ChatPanel {currentChatUser} />
            {/if}
        </div>
    </div>
    <MessageModal showModal={showMessageModal} on:closeModal={closeMessageModal} />
</div>
