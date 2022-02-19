import {
  adsb,
  adsb_plane,
  adsb_target,
  aircraft_icon,
  plane,
} from "src/interfaces";

class MessageHandler {
  planes: Array<plane> = [];
  adsb_last_update_time: number = 0;

  constructor() {
    this.planes = [];

    // Overload the unshift operator for the planes array
    // The array should keep only 50 planes with messages if they DO NOT
    // have an ADSB position
    this.planes.unshift = (p: plane) => {
      if (this.planes.length >= 50) {
        let indexes_to_delete: Array<number> = []; // All of the indexes with messages and ADSB positions

        // Find all of the planes with no ADSB position and messages
        this.planes.forEach((plane, index) => {
          if (!plane.position && plane.messages) indexes_to_delete.push(index);
        });

        // Only delete any in excess of 50
        const index_to_splice = indexes_to_delete.length > 50 ? 49 : 0;

        if (index_to_splice) {
          indexes_to_delete
            .splice(index_to_splice) // remove all of the "new" planes
            .sort((a, b) => b - a) // reverse the sort so we don't fuck up the indexes we've saved relative to the old array
            .forEach((index) => {
              this.planes.splice(index, 1);
            });
        }
      }
      return this.planes.unshift.apply(this.planes, [p]);
    };
  }

  acars_message() {}

  adsb_message(adsb_positions: adsb) {
    this.adsb_last_update_time = adsb_positions.now;

    adsb_positions.aircraft.forEach((target) => {
      const callsign = this.get_callsign(target);
      const hex = this.get_hex(target);
      const tail = this.get_tail(target);
      const plane = this.match_plane_from_id(callsign, hex, tail);
      if (plane) {
        this.update_plane_position(target, plane);
      } else {
        this.planes.push({
          callsign: callsign,
          hex: hex,
          tail: tail,
          position: target,
          identifiers: [], // TODO REMOVE ME
          messages: [],
          has_alerts: false,
          num_alerts: 0,
          last_updated: this.adsb_last_update_time,
        });
      }
    });

    // now loop through all of the planes and make sure their positions are still valid. Remove if not found
    this.planes.forEach((plane, index) => {
      if (
        plane.position &&
        plane.last_updated &&
        plane.last_updated < this.adsb_last_update_time
      ) {
        this.planes[index].last_updated = undefined;
        this.planes[index].position = undefined;
      }
    });
  }

  update_plane_position(
    plane: adsb_plane | undefined = undefined,
    index: number | undefined = undefined
  ) {
    if (!index || !plane) return;

    this.planes[index].position = plane;
    this.planes[index].last_updated = this.adsb_last_update_time;
  }

  match_plane_from_id(
    callsign: string | null = null,
    hex: string | null = null,
    tail: string | null = null
  ) {
    Object.values(this.planes).forEach((plane, index) => {
      if (callsign && plane.callsign === callsign) {
        return index;
      }
      if (hex && plane.hex === hex) {
        return index;
      }
      if (tail && plane.tail === tail) {
        return index;
      }
    });

    return undefined;
  }

  get_callsign(plane: adsb_plane): string {
    return (
      plane.flight && plane.flight.trim() !== ""
        ? plane.flight.trim()
        : plane.r && plane.r !== ""
        ? plane.r
        : plane.hex
    )
      .replace("~", "")
      .replace(".", "")
      .replace("-", "")
      .toUpperCase();
  }

  get_sqwk(plane: adsb_plane): number {
    return plane.squawk || 0;
  }

  get_alt(plane: adsb_plane): string | number {
    return plane.alt_baro ? String(plane.alt_baro).toUpperCase() : 0;
  }

  get_speed(plane: adsb_plane): number {
    return plane.gs ? plane.gs : 0;
  }

  get_tail(plane: adsb_plane): string {
    return plane.r
      ? plane.r.replace("-", "").replace(".", "").replace("~", "")
      : <any>undefined;
  }

  get_hex(plane: adsb_plane): string {
    return plane.hex
      ? plane.hex
          .replace("-", "")
          .replace(".", "")
          .replace("~", "")
          .toUpperCase()
      : <any>undefined;
  }

  get_baro_rate(plane: adsb_plane): number {
    return plane.baro_rate ? plane.baro_rate : 0;
  }

  get_heading(plane: adsb_plane): number {
    return plane.track || 0;
  }

  get_ac_type(plane: adsb_plane): string {
    return plane.t || <any>undefined;
  }

  // get_icon(plane: string): aircraft_icon | null {
  //   return this.adsb_planes[plane].icon || <any>undefined;
  // }

  get_lat(plane: adsb_plane): number {
    return plane.lat || 0;
  }

  get_lon(plane: adsb_plane): number {
    return plane.lon || 0;
  }
}
