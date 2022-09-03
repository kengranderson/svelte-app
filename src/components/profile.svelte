{#if user.isAuthenticated()}
<div class="card card-primary card-outline">
    <div class="card-header">
        <h5 class="m-0">User: {user.email}</h5>
    </div>
    <div class="card-body">
        <fieldset class="card-group">
            <legend>Profile</legend>
            <div class="card-text">
                User Id: {user.userid}
            </div>
            <div class="card-text">
                Email: {user.email}
            </div>
        </fieldset>

        <fieldset class="card-group">
            <legend>Groups</legend>
            <ul>
            {#each user.groups as group}
                <li>{group}</li>
             {/each}
            </ul>
        </fieldset>
    </div>
</div>
{:else}
<div class="card">
    <div class="card-body">
        <h5 class="card-title">Not Logged In</h5>
    </div>
</div>
{/if}

<script>
	import { UserStore } from '../stores/UserStore';
    $: user = $UserStore;
</script>
