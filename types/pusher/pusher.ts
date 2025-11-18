export interface PusherSendPayload {
  profile_uuid: string;
  pusher_data: {
    event_name: string;
    user_id: string;
    profile_uuid: string;
    msg: string;
  };
}
