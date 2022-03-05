import { LocalStorageSettings } from "src/interfaces";

export class Settings {
  settings = {
    general_use_metric_altitude: false,
    general_use_metric_distance: false,
    general_convert_to_flight_levels: true,

    alerts_play_sound: false,
    alerts_list_of_blacklist_terms: [],
    alerts_list_of_whitelist_terms: [],
    adsb_update_rate: 5,
    live_map_show_range_rings: true,
    live_map_range_ring_color: "#00000",
    live_map_range_ring_miles: [0, 25, 50, 100, 200],
    live_map_show_adsb_trails: false, // TODO: save adsb position history
    live_map_show_datablocks: false,
    live_map_show_full_datablocks: false,
    live_map_show_only_planes_with_messages: false,

    live_messages_page_num_items: 20,
    live_messages_page_exclude_labels: [] as Array<string>,
    live_messages_page_exclude_empty: false,
  } as LocalStorageSettings;

  constructor() {
    this.init();
  }

  init() {
    this.lm_page_num_items_init();
    this.lm_page_exclude_labels_init();
    this.live_messages_page_exclude_empty_init();
    this.general_use_metric_altitude_init();
    this.general_use_metric_distance_init();
    this.general_convert_to_flight_levels_init();
    this.alerts_play_sound_init();
    this.alerts_list_of_blacklist_terms_init();
    this.alerts_list_of_whitelist_terms_init();
    this.adsb_update_rate_init();
    this.live_map_show_range_rings_init();
    this.live_map_range_ring_color_init();
    this.live_map_range_ring_miles_init();
    this.live_map_show_adsb_trails_init();
    this.live_map_show_datablocks_init();
    this.live_map_show_full_datablocks_init();
    this.live_map_show_only_planes_with_messages_init();
  }

  get_alerts_play_sound() {
    return this.settings.alerts_play_sound;
  }

  get_alerts_list_of_blacklist_terms() {
    return this.settings.alerts_list_of_blacklist_terms;
  }

  get_alerts_list_of_whitelist_terms() {
    return this.settings.alerts_list_of_whitelist_terms;
  }

  get_adsb_update_rate() {
    return this.settings.adsb_update_rate;
  }

  get_live_map_show_range_rings() {
    return this.settings.live_map_show_range_rings;
  }

  get_live_map_range_ring_color() {
    return this.settings.live_map_range_ring_color;
  }

  get_live_map_range_ring_miles() {
    return this.settings.live_map_range_ring_miles;
  }

  get_live_map_show_adsb_trails() {
    return this.settings.live_map_show_adsb_trails;
  }

  get_live_map_show_datablocks() {
    return this.settings.live_map_show_datablocks;
  }

  get_live_map_show_full_datablocks() {
    return this.settings.live_map_show_full_datablocks;
  }

  get_show_only_planes_with_messages() {
    return this.settings.live_map_show_only_planes_with_messages;
  }

  get_general_use_metric_altitude() {
    return this.settings.general_use_metric_altitude;
  }

  get_general_use_metric_distance() {
    return this.settings.general_use_metric_distance;
  }

  get_general_convert_to_flight_level() {
    return this.settings.general_convert_to_flight_levels;
  }

  get_live_messages_page_exclude_labels() {
    return this.settings.live_messages_page_exclude_labels;
  }

  get_live_messages_page_num_items() {
    return this.settings.live_messages_page_num_items;
  }

  get_live_messages_page_exclude_empty() {
    return this.settings.live_messages_page_exclude_empty;
  }

  set_general_convert_to_flight_level(convert_to_flight_levels: boolean) {
    this.settings.general_convert_to_flight_levels = convert_to_flight_levels;
  }

  set_general_use_metric_altitude(use_metric_units: boolean) {
    this.settings.general_use_metric_altitude = use_metric_units;
    localStorage.setItem(
      "general_use_metric_altitude",
      JSON.stringify(use_metric_units)
    );
  }

  set_general_use_metric_distance(use_metric_units: boolean) {
    this.settings.general_use_metric_distance = use_metric_units;
    localStorage.setItem(
      "general_use_metric_distance",
      JSON.stringify(use_metric_units)
    );
  }

  set_alerts_play_sound(play_sound: boolean) {
    this.settings.alerts_play_sound = play_sound;
    localStorage.setItem("alerts_play_sound", JSON.stringify(play_sound));
  }

  set_alerts_list_of_blacklist_terms(list_of_blacklist_terms: Array<string>) {
    let formatted_input: Array<string> = [];
    list_of_blacklist_terms.forEach((term) => {
      if (term && term !== "") formatted_input.push(term.toUpperCase().trim());
    });

    this.settings.alerts_list_of_blacklist_terms = formatted_input;
    localStorage.setItem(
      "alerts_list_of_blacklist_terms",
      JSON.stringify(formatted_input)
    );
  }

  set_alerts_list_of_whitelist_terms(list_of_whitelist_terms: Array<string>) {
    let formatted_input: Array<string> = [];

    list_of_whitelist_terms.forEach((term) => {
      if (term && term !== "") formatted_input.push(term.toUpperCase().trim());
    });

    this.settings.alerts_list_of_whitelist_terms = formatted_input;
    localStorage.setItem(
      "alerts_list_of_whitelist_terms",
      JSON.stringify(formatted_input)
    );
  }

  set_adsb_update_rate(adsb_update_rate: number) {
    // ADSB Update Rate has to be between .5 and 60 seconds
    if (isNaN(adsb_update_rate)) adsb_update_rate = 5;
    if (adsb_update_rate < 0.5) adsb_update_rate = 0.5;
    else if (adsb_update_rate > 60) adsb_update_rate = 60;

    this.settings.adsb_update_rate = adsb_update_rate;
    localStorage.setItem("adsb_update_rate", JSON.stringify(adsb_update_rate));
  }

  set_live_map_show_range_rings(show_range_rings: boolean) {
    this.settings.live_map_show_range_rings = show_range_rings;
    localStorage.setItem(
      "live_map_show_range_rings",
      JSON.stringify(show_range_rings)
    );
  }

  set_live_map_range_ring_color(range_ring_color: string) {
    if (!range_ring_color.startsWith("#"))
      range_ring_color = "#" + range_ring_color;
    if (/^#([0-9A-F]{3}){1,2}$/i.test(range_ring_color)) {
      this.settings.live_map_range_ring_color = range_ring_color;
      localStorage.setItem(
        "live_map_range_ring_color",
        JSON.stringify(range_ring_color)
      );
    }
  }

  set_live_map_range_ring_miles(range_ring_miles: Array<number>) {
    let formatted_input: Array<number> = [];
    range_ring_miles.forEach((miles) => {
      if (!isNaN(miles) && miles > 0) formatted_input.push(miles);
    });

    formatted_input.sort();

    this.settings.live_map_range_ring_miles = formatted_input;
    localStorage.setItem(
      "live_map_range_ring_miles",
      JSON.stringify(formatted_input)
    );
  }

  set_live_map_show_adsb_trails(show_adsb_trails: boolean) {
    this.settings.live_map_show_adsb_trails = show_adsb_trails;
    localStorage.setItem(
      "live_map_show_adsb_trails",
      JSON.stringify(show_adsb_trails)
    );
  }

  set_live_map_show_datablocks(show_datablocks: boolean) {
    this.settings.live_map_show_datablocks = show_datablocks;
    localStorage.setItem(
      "live_map_show_datablocks",
      JSON.stringify(show_datablocks)
    );
  }

  set_live_map_show_full_datablocks(show_full_datablocks: boolean) {
    this.settings.live_map_show_full_datablocks = show_full_datablocks;
    localStorage.setItem(
      "live_map_show_full_datablocks",
      JSON.stringify(show_full_datablocks)
    );
  }

  set_show_only_planes_with_messages(show_only_planes_with_messages: boolean) {
    this.settings.live_map_show_only_planes_with_messages =
      show_only_planes_with_messages;
    localStorage.setItem(
      "live_map_show_only_planes_with_messages",
      JSON.stringify(show_only_planes_with_messages)
    );
  }

  set_live_messages_page_exclude_labels(labels: Array<string>) {
    this.settings.live_messages_page_exclude_labels = labels;
    localStorage.setItem(
      "live_messages_page_exclude_labels",
      JSON.stringify(labels)
    );
  }

  set_live_messages_page_num_items(num_items: number) {
    if (!isNaN(num_items)) num_items = 20;
    if (num_items < 1) num_items = 20;
    if (num_items > 50) num_items = 50;

    this.settings.live_messages_page_num_items = num_items;
    localStorage.setItem(
      "live_messages_page_num_items",
      JSON.stringify(num_items)
    );
  }

  set_live_messages_page_exclude_empty(exclude_empty: boolean) {
    this.settings.live_messages_page_exclude_empty = exclude_empty;
    localStorage.setItem(
      "live_messages_page_exclude_empty",
      JSON.stringify(exclude_empty)
    );
  }

  private lm_page_num_items_init() {
    const live_messages_page_num_items = localStorage.getItem(
      "live_messages_page_num_items"
    );
    if (live_messages_page_num_items) {
      this.settings.live_messages_page_num_items = Number(
        live_messages_page_num_items
      );
    } else {
      localStorage.setItem(
        "live_messages_page_num_items",
        this.settings.live_messages_page_num_items.toString()
      );
    }
  }

  private lm_page_exclude_labels_init() {
    const live_messages_page_exclude_labels = localStorage.getItem(
      "live_messages_page_exclude_labels"
    );
    if (live_messages_page_exclude_labels) {
      this.settings.live_messages_page_exclude_labels = JSON.parse(
        live_messages_page_exclude_labels
      );
    } else {
      localStorage.setItem(
        "live_messages_page_exclude_labels",
        JSON.stringify(this.settings.live_messages_page_exclude_labels)
      );
    }
  }

  private live_messages_page_exclude_empty_init() {
    const live_messages_page_exclude_empty = localStorage.getItem(
      "live_messages_page_exclude_empty"
    );
    if (live_messages_page_exclude_empty) {
      this.settings.live_messages_page_exclude_empty = JSON.parse(
        live_messages_page_exclude_empty
      );
    } else {
      localStorage.setItem(
        "live_messages_page_exclude_empty",
        JSON.stringify(this.settings.live_messages_page_exclude_empty)
      );
    }
  }

  private general_convert_to_flight_levels_init() {
    const convert_to_flight_levels = localStorage.getItem(
      "convert_to_flight_levels"
    );
    if (convert_to_flight_levels) {
      this.settings.convert_to_flight_levels = JSON.parse(
        convert_to_flight_levels
      );
    } else {
      localStorage.setItem(
        "convert_to_flight_levels",
        JSON.stringify(this.settings.convert_to_flight_levels)
      );
    }
  }

  private general_use_metric_altitude_init() {
    const general_use_metric_units = localStorage.getItem(
      "general_use_metric_altitude"
    );
    if (general_use_metric_units) {
      this.settings.general_use_metric_altitude = JSON.parse(
        general_use_metric_units
      );
    } else {
      localStorage.setItem(
        "general_use_metric_altitude",
        JSON.stringify(this.settings.general_use_metric_altitude)
      );
    }
  }

  private general_use_metric_distance_init() {
    const general_use_metric_distance = localStorage.getItem(
      "general_use_metric_distance"
    );
    if (general_use_metric_distance) {
      this.settings.general_use_metric_distance = JSON.parse(
        general_use_metric_distance
      );
    } else {
      localStorage.setItem(
        "general_use_metric_distance",
        JSON.stringify(this.settings.general_use_metric_distance)
      );
    }
  }

  private alerts_play_sound_init() {
    const alerts_play_sound = localStorage.getItem("alerts_play_sound");
    if (alerts_play_sound) {
      this.settings.alerts_play_sound = JSON.parse(alerts_play_sound);
    } else {
      localStorage.setItem(
        "alerts_play_sound",
        JSON.stringify(this.settings.alerts_play_sound)
      );
    }
  }

  private alerts_list_of_blacklist_terms_init() {
    const alerts_list_of_blacklist_terms = localStorage.getItem(
      "alerts_list_of_blacklist_terms"
    );
    if (alerts_list_of_blacklist_terms) {
      this.settings.alerts_list_of_blacklist_terms = JSON.parse(
        alerts_list_of_blacklist_terms
      );
    } else {
      localStorage.setItem(
        "alerts_list_of_blacklist_terms",
        JSON.stringify(this.settings.alerts_list_of_blacklist_terms)
      );
    }
  }

  private alerts_list_of_whitelist_terms_init() {
    const alerts_list_of_whitelist_terms = localStorage.getItem(
      "alerts_list_of_whitelist_terms"
    );
    if (alerts_list_of_whitelist_terms) {
      this.settings.alerts_list_of_whitelist_terms = JSON.parse(
        alerts_list_of_whitelist_terms
      );
    } else {
      localStorage.setItem(
        "alerts_list_of_whitelist_terms",
        JSON.stringify(this.settings.alerts_list_of_whitelist_terms)
      );
    }
  }

  private adsb_update_rate_init() {
    const adsb_update_rate = localStorage.getItem("adsb_update_rate");
    if (adsb_update_rate) {
      this.settings.adsb_update_rate = JSON.parse(adsb_update_rate);
    } else {
      localStorage.setItem(
        "adsb_update_rate",
        JSON.stringify(this.settings.adsb_update_rate)
      );
    }
  }

  private live_map_show_range_rings_init() {
    const live_map_show_range_rings = localStorage.getItem(
      "live_map_show_range_rings"
    );
    if (live_map_show_range_rings) {
      this.settings.live_map_show_range_rings = JSON.parse(
        live_map_show_range_rings
      );
    } else {
      localStorage.setItem(
        "live_map_show_range_rings",
        JSON.stringify(this.settings.live_map_show_range_rings)
      );
    }
  }

  private live_map_range_ring_color_init() {
    const live_map_range_ring_color = localStorage.getItem(
      "live_map_range_ring_color"
    );
    if (live_map_range_ring_color) {
      this.settings.live_map_range_ring_color = JSON.parse(
        live_map_range_ring_color
      );
    } else {
      localStorage.setItem(
        "live_map_range_ring_color",
        JSON.stringify(this.settings.live_map_range_ring_color)
      );
    }
  }

  private live_map_range_ring_miles_init() {
    const live_map_range_ring_miles = localStorage.getItem(
      "live_map_range_ring_miles"
    );
    if (live_map_range_ring_miles) {
      this.settings.live_map_range_ring_miles = JSON.parse(
        live_map_range_ring_miles
      );
    } else {
      localStorage.setItem(
        "live_map_range_ring_miles",
        JSON.stringify(this.settings.live_map_range_ring_miles)
      );
    }
  }

  private live_map_show_adsb_trails_init() {
    const live_map_show_adsb_trails = localStorage.getItem(
      "live_map_show_adsb_trails"
    );
    if (live_map_show_adsb_trails) {
      this.settings.live_map_show_adsb_trails = JSON.parse(
        live_map_show_adsb_trails
      );
    } else {
      localStorage.setItem(
        "live_map_show_adsb_trails",
        JSON.stringify(this.settings.live_map_show_adsb_trails)
      );
    }
  }

  private live_map_show_datablocks_init() {
    const live_map_show_datablocks = localStorage.getItem(
      "live_map_show_datablocks"
    );
    if (live_map_show_datablocks) {
      this.settings.live_map_show_datablocks = JSON.parse(
        live_map_show_datablocks
      );
    } else {
      localStorage.setItem(
        "live_map_show_datablocks",
        JSON.stringify(this.settings.live_map_show_datablocks)
      );
    }
  }

  private live_map_show_full_datablocks_init() {
    const live_map_show_full_datablocks = localStorage.getItem(
      "live_map_show_full_datablocks"
    );
    if (live_map_show_full_datablocks) {
      this.settings.live_map_show_full_datablocks = JSON.parse(
        live_map_show_full_datablocks
      );
    } else {
      localStorage.setItem(
        "live_map_show_full_datablocks",
        JSON.stringify(this.settings.live_map_show_full_datablocks)
      );
    }
  }

  private live_map_show_only_planes_with_messages_init() {
    const live_map_show_only_planes_with_messages = localStorage.getItem(
      "live_map_show_only_planes_with_messages"
    );
    if (live_map_show_only_planes_with_messages) {
      this.settings.live_map_show_only_planes_with_messages = JSON.parse(
        live_map_show_only_planes_with_messages
      );
    } else {
      localStorage.setItem(
        "live_map_show_only_planes_with_messages",
        JSON.stringify(this.settings.live_map_show_only_planes_with_messages)
      );
    }
  }

  get_setting(key: string) {
    if (this.settings && this.settings[key]) {
      return this.settings[key];
    }
    return null;
  }
}
