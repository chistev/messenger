<script>
    import { onMount } from 'svelte';
    import Spinner from '../../../components/Spinner.svelte';
    import ChatPanel from '../../../components/ChatPanel.svelte';
    import MessageModal from '../../../components/MessageModal.svelte';
    import SelectedUsersList from '../../../components/SelectedUsersList.svelte';
    import Settings from '../../../components/Settings.svelte';
    import { getJwtToken } from '../../../utils/utils';

    let showSettings = false;
    let showMessageModal = false;
    let selectedUsers = [];
    let loading = true;
    let currentChatUser = null;

    function toggleSettings() {
        showSettings = !showSettings;
        console.log("Settings toggled. Show settings:", showSettings);
    }

    function toggleMessageModal() {
        showMessageModal = !showMessageModal;
        document.querySelector('.page-container').style.backgroundColor = showMessageModal ? '#242d34' : '#000000';
        console.log("Message modal toggled. Show message modal:", showMessageModal);
    }

    function closeMessageModal() {
        showMessageModal = false;
        document.querySelector('.page-container').style.backgroundColor = '#000000';
        console.log("Message modal closed.");
    }

    function handleUserSelection(event) {
        currentChatUser = event.detail;
        history.pushState(null, '', `/messages/${currentChatUser._id}`);
        console.log("User selected:", currentChatUser);
    }

    async function fetchUserById(userId) {
        console.log("Fetching user by ID:", userId);
        const jwtToken = getJwtToken();
        try {
            const response = await fetch(`https://messenger-tu85.onrender.com/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorText = await response.text(); // Get error text
                console.error(`Failed to fetch user: ${response.status} ${response.statusText} - ${errorText}`);
                throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
            }

            const user = await response.json();
            console.log("User fetched:", user);
            return user;
        } catch (err) {
            console.error('Error fetching user:', err);
            throw err; // Re-throw error to handle in onMount
        }
    }

    onMount(async () => {
        const userId = window.location.pathname.split('/').pop(); 
        console.log("Page mounted. User ID from URL:", userId);

        try {
            const jwtToken = getJwtToken();
            console.log("Fetching selected users. JWT Token:", jwtToken);
            const response = await fetch('https://messenger-tu85.onrender.com/api/selected-users', {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get error text
                console.error(`Failed to fetch selected users: ${response.status} ${response.statusText} - ${errorText}`);
                throw new Error(`Failed to fetch selected users: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            selectedUsers = data.selectedUsers;
            console.log("Selected users fetched:", selectedUsers); 

            if (userId) {
                currentChatUser = await fetchUserById(userId);
                console.log("Current chat user set:", currentChatUser); 
            }
        } catch (err) {
            console.error('Error during onMount:', err);
        } finally {
            loading = false;
            console.log("Loading finished. Current chat user:", currentChatUser);
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
