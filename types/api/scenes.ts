export interface Scene {
  action_day: string;
  chars: string;
  chars_action: string;
  chars_total: string;
  chronological: number;
  day_night: string;
  emotion_label: string;
  episode_order: string;
  episode_uuid: string;
  flow_exception: string;
  flow_text: string;
  int_ext: string;
  length: string;
  location: string;
  scene_endpoint: string;
  scene_id: string;
  scene_synopsis: string;
  scene_title: string;
  scene_uuid: string;
  scene_warnings: string;
  screen_time: string;
  specific_rooms: string;
  syntax_label: string;
  warnings: string;
  line_color?: string;
}

// 🔹 Respuesta cruda de la API (antes de filtrar)
export interface ScenesApiResponse {
  scenes: Scene[];
  values: unknown[];
}

// 🔹 Lo que realmente guardaremos en el store
export type ScenesResponse = Scene[];

// 🔹 Payload de petición
export interface SecenesPayload {
  profile_uuid: string;
  serie_uuid: string;
}
