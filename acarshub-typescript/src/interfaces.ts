// Copyright (C) 2022 Frederick Clausen II
// This file is part of acarshub <https://github.com/sdr-enthusiasts/docker-acarshub>.

// acarshub is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// acarshub is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with acarshub.  If not, see <http://www.gnu.org/licenses/>.

export interface planes_array extends Array<plane> {
  prepend: (item: plane) => number;
}

export interface plane {
  uid: string;
  callsign?: string;
  hex?: string;
  tail?: string;
  has_alerts: boolean;
  num_alerts: number;
  selected_tab: string;
  manually_selected_tab: boolean;
  messages: acars_msg[];
  position?: adsb_plane;
  position_history: aircraft_position[];
  last_updated?: number;
}

export interface aircraft_position {
  gs?: number;
  ias?: number;
  tas?: number;
  mach?: number;
  track?: number;
  track_rate?: number;
  roll?: number;
  mag_heading?: number;
  true_heading?: number;
  baro_rate?: number;
  geom_rate?: number;
  lat?: number;
  lon?: number;
}

export interface acars_msg {
  [index: string]: any;
  timestamp: number;
  station_id: string;
  toaddr?: string;
  fromaddr?: string;
  depa?: string;
  dsta?: string;
  eta?: string;
  gtout?: string;
  gtin?: string;
  wloff?: string;
  wlin?: string;
  lat?: number;
  lon?: number;
  alt?: number;
  text?: string;
  tail?: string;
  flight?: string;
  icao?: number;
  freq?: number;
  ack?: string;
  mode?: string;
  label?: string;
  block_id?: string;
  msgno?: string;
  is_response?: number;
  is_onground?: number;
  error?: number | string;
  libacars?: any;
  level?: number;
  matched: boolean; // This line and below are custom parameters injected by javascript or from the backend
  matched_text: string[];
  uid: string;
  decodedText?: any; // no type for typescript acars decoder; so set to any
  data?: string;
  message_type: string;
  msg_time?: number;
  duplicates?: string;
  msgno_parts?: string;
  label_type?: string;
  toaddr_decoded?: string;
  toaddr_hex?: string;
  fromaddr_hex?: string;
  fromaddr_decoded?: string;
  icao_url?: string;
  icao_hex?: string;
  decoded_msg?: string;
  icao_flight?: string;
}

export interface adsb {
  now: number;
  messages: number;
  aircraft: adsb_plane[];
}

export interface adsb_plane {
  hex: string;
  type: string;
  flight: string;
  alt_baro?: number;
  alt_geom?: number;
  gs?: number;
  ias?: number;
  tas?: number;
  mach?: number;
  track?: number;
  track_rate?: number;
  roll?: number;
  mag_heading?: number;
  true_heading?: number;
  baro_rate?: number;
  geom_rate?: number;
  squawk?: number;
  emergency?: number;
  category?: number;
  nav_qnh?: number;
  nav_altitude_mcp?: number;
  nav_altitude_fms?: number;
  nav_heading?: number;
  nav_modes?: number;
  lat?: number;
  lon?: number;
  nic?: number;
  rc?: number;
  seen_pos?: number;
  version?: number;
  nic_baro?: number;
  nac_p?: number;
  nac_v?: number;
  sil?: number;
  sil_type?: number;
  gva?: number;
  sda?: number;
  mlat?: string[];
  tisb?: string[];
  messages?: number;
  seen?: number;
  rssi?: number;
  alert?: number;
  spi?: number;
  wd?: number;
  ws?: number;
  oat?: number;
  tat?: number;
  t?: string;
  r?: string;
}

export interface html_msg {
  msghtml: acars_msg;
  loading?: boolean;
  done_loading?: boolean;
}

export interface decoders {
  acars: boolean;
  vdlm: boolean;
  arch: string;
  adsb: {
    enabled: boolean;
    lat: number;
    lon: number;
    url: string;
    bypass: boolean;
    range_rings: boolean;
  };
}

export interface system_status {
  status: {
    error_state: boolean;
    decoders: status_decoder;
    servers: status_server;
    feeders: status_decoder;
    global: status_global;
    stats: status_decoder;
    external_formats: status_external_formats;
  };
}

export interface signal {
  levels: {
    [index: number]: {
      count: number;
      id: number;
      level: number;
    };
  };
}

export interface alert_term {
  data: {
    [index: number]: {
      count: number;
      id: number;
      term: string;
    };
  };
}

export interface signal_freq_data {
  freqs: Array<signal_data>;
}

interface signal_data {
  freq_type: string;
  freq: string;
  count: number;
}

export interface signal_count_data {
  count: {
    non_empty_total: number;
    non_empty_errors: number;
    empty_total: number;
    empty_errors: number;
  };
}

export interface status_server {
  [index: string]: {
    Status: string;
    Web: string;
  };
}

export interface status_decoder {
  [index: string]: {
    Status: string;
  };
}

export interface status_global {
  [index: string]: {
    Status: string;
    Count: number;
  };
}

export interface status_external_formats {
  [index: string]: [
    {
      Status: string;
      type: string;
    }
  ];
}

export interface LocalStorageSettings {
  [index: string]: any;
  general_use_metric_altitude: boolean;
  general_use_metric_distance: boolean;
  general_convert_to_flight_levels: boolean;
  general_transition_altitude: number;
  alerts_play_sound: boolean;
  alerts_list_of_blacklist_terms: Array<string>;
  alerts_list_of_whitelist_terms: Array<string>;
  adsb_update_rate: number;
  live_map_show_range_rings: boolean;
  live_map_range_ring_color: string;
  live_map_range_ring_miles: Array<number>;
  live_map_show_adsb_trails: boolean; // TODO: save adsb position history
  live_map_show_datablocks: boolean;
  live_map_show_full_datablocks: boolean;
  live_map_show_only_planes_with_messages: boolean;
  live_messages_page_num_items: number;
  live_messages_page_exclude_labels: Array<string>;
  live_messages_page_exclude_empty: boolean;
}

export interface LocalStorageSettingsDisplayProperties {
  [index: string]: SettingDisplayProperties;
}

export interface SettingDisplayProperties {
  LocalStorageSettingPropertyName: string;
  LocalStorageSettingPropertyType: string;
  LocalStorageSettingPropertyDefault: any;
  LocalStorageSettingPropertyAllowedValues?: Array<string>;
  LocalStorageSettingPropertyDisplayCategory: string;
  LocalStorageSettingPropertyDisplayName: string;
  LocalStorageSettingPropertyToolTip: string;
  LocalStorageSettingPropertyNumberMax?: number;
  LocalStorageSettingPropertyNumberMin?: number;
  LocalStorageSettingPropertyNumberStep?: number;
}

// Interface for setting alert terms

export interface alert_terms {
  text_terms: string[];
  ignore: string[];
}

export interface LiveMessagesPage {
  update_page(planes: plane[] | undefined, dont_reset_page?: boolean): void;
  update_page_in_place(planes: plane[] | undefined): void;
  set_page_inactive(): void;
  set_page_active(): void;
}

export interface SettingsPage {
  update_page(): void;
  set_page_inactive(): void;
  set_page_active(): void;
  update_alerts(): void;
}
