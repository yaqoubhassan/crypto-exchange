<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Private user channel for notifications
Broadcast::channel('user.{userId}', function ($user, $userId) {
  return (int) $user->id === (int) $userId;
});

// Admin channel for admin-specific notifications
Broadcast::channel('admin', function ($user) {
  return $user->is_admin;
});
