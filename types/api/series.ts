export interface SeriesPayload {
  profile_uuid: string;
}

export interface SeriesResponse {
  serie_timestamp: number;
  serie_initials: string;
  serie_uuid: string;
  serie_title: string;
  serie_episodes: string[];
  serie_type: string;
  serie_stage: string;
  shootplan_uuid: string | undefined;
}
