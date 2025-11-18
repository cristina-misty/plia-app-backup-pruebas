export interface ProfilePayload {
  profile_uuid: string;
}

export interface ProfileResponse {
  profile_uuid: string;
  serie_timestamp: number;
  serie_initials: string;
  name: string;
  email: string;
  serie_uuid: string;
  serie_title: string;
  series_acl: string[];
  serie_episodes: string[];
  serie_type: string;
  serie_stage: string | null | undefined;
  shootplan_uuid: string | null | undefined;
}
