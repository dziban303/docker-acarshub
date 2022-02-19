import { MessageDecoder } from "@airframes/acars-decoder/dist/MessageDecoder";
import { acars_msg, adsb, adsb_plane, plane } from "src/interfaces";

export class MessageHandler {
  planes: Array<plane> = [];
  adsb_last_update_time: number = 0;
  lm_md = new MessageDecoder();
  msg_tags = [
    "text",
    "data",
    "libacars",
    "dsta",
    "depa",
    "eta",
    "gtout",
    "gtin",
    "wloff",
    "wlin",
    "lat",
    "lon",
    "alt",
  ] as Array<keyof acars_msg>;

  constructor() {
    this.planes = [];

    // Overload the unshift operator for the planes array
    // The array should keep only 50 planes with messages if they DO NOT
    // have an ADSB position
    // @ts-expect-error
    this.planes.prepend = (p: plane) => {
      console.log(this.planes.length);
      if (this.planes.length >= 50) {
        let indexes_to_delete: Array<number> = []; // All of the indexes with messages and ADSB positions

        // Find all of the planes with no ADSB position and messages
        this.planes.forEach((plane, index) => {
          if (!plane.position && plane.messages) indexes_to_delete.push(index);
        });

        // Only delete any in excess of 50
        const index_to_splice: number =
          indexes_to_delete.length > 50 ? indexes_to_delete.length - 49 : 0;
        console.log("j", index_to_splice);
        if (index_to_splice > 0) {
          indexes_to_delete
            .splice(0, index_to_splice) // remove all of the "new" planes
            .sort((a, b) => b - a) // reverse the sort so we don't fuck up the indexes we've saved relative to the old array
            .forEach((index) => {
              this.planes.splice(index, 1);
            });
        }
      }
      return this.planes.unshift.apply(this.planes, [p]);
    };
  }

  acars_message(msg: acars_msg) {
    const callsign = this.get_callsign_from_acars(msg);
    const hex = this.get_hex_from_acars(msg);
    const tail = this.get_tail_from_acars(msg);
    const plane = this.match_plane_from_id(callsign, hex, tail);
    if (plane) {
      this.update_plane_message(msg, plane);
    } else {
      // @ts-expect-error
      this.planes.prepend({
        callsign: callsign,
        hex: hex,
        tail: tail,
        position: undefined,
        identifiers: [], // TODO REMOVE ME
        messages: [msg],
        has_alerts: false,
        num_alerts: 0,
        last_updated: this.adsb_last_update_time,
      });
    }

    console.log(this.planes.length);
  }

  adsb_message(adsb_positions: adsb) {
    this.adsb_last_update_time = adsb_positions.now;

    adsb_positions.aircraft.forEach((target) => {
      const callsign = this.get_callsign_from_adsb(target);
      const hex = this.get_hex_from_adsb(target);
      const tail = this.get_tail_from_adsb(target);
      const plane = this.match_plane_from_id(callsign, hex, tail);
      if (plane) {
        this.update_plane_position(target, plane);
      } else {
        this.planes.unshift({
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

  update_plane_message(new_msg: acars_msg, index: number) {
    if (typeof this.planes[index].messages === "undefined") {
      this.planes[index].messages = [new_msg];
      return;
    }
    let rejected = false;
    let move_or_delete_id: undefined | string = undefined;

    // TODO: add in alert matching
    let matched = { was_found: false };

    // TODO: remove this ! check for TS
    for (let message of this.planes[index].messages!) {
      // First check is to see if the message is the same by checking all fields and seeing if they match
      // Second check is to see if the text field itself is a match
      // Last check is to see if we've received a multi-part message
      // If we do find a match we'll update the timestamp of the parent message
      // And add/update a duplicate counter to the parent message
      if (this.check_for_dup(message, new_msg)) {
        // Check if the message is a dup based on all fields
        message.timestamp = new_msg.timestamp;
        message.duplicates = String(Number(message.duplicates || 0) + 1);
        rejected = true;
        move_or_delete_id =
          this.planes[index].messages![this.planes[index].messages!.length - 1]
            .uid;
      } else if (
        // check if text fields are the same
        "text" in message &&
        "text" in new_msg &&
        message.text == new_msg.text
      ) {
        // it's the same message
        message.timestamp = new_msg.timestamp;
        message.duplicates = String(Number(message.duplicates || 0) + 1);
        rejected = true;
        move_or_delete_id =
          this.planes[index].messages![this.planes[index].messages!.length - 1]
            .uid;
      } else if (
        new_msg.station_id == message.station_id && // Is the message from the same station id? Keep ACARS/VDLM separate
        new_msg.timestamp - message.timestamp < 8.0 && // We'll assume the message is not a multi-part message if the time from the new message is too great from the rest of the group
        typeof new_msg.msgno !== "undefined" && // For reasons unknown to me TS is throwing an error if we don't check for undefined
        typeof message.msgno !== "undefined" && // Even though we can't reach this point if the message doesn't have a msgno
        ((new_msg.msgno.charAt(0) == message.msgno.charAt(0) && // Next two lines match on AzzA pattern
          new_msg.msgno.charAt(3) == message.msgno.charAt(3)) ||
          new_msg.msgno.substring(0, 3) == message.msgno.substring(0, 3))
      ) {
        // This check matches if the group is a AAAz counter
        // We have a multi part message. Now we need to see if it is a dup
        rejected = true;
        move_or_delete_id =
          this.planes[index].messages![this.planes[index].messages!.length - 1]
            .uid;
        let add_multi = true;

        if ("msgno_parts" in message) {
          // Now we'll see if the multi-part message is a dup
          let split = message.msgno_parts!.toString().split(" "); // format of stored parts is "MSGID MSGID2" etc

          for (let a = 0; a < split.length; a++) {
            // Loop through the msg IDs present
            if (split[a].substring(0, 4) == new_msg.msgno) {
              // Found a match in the message IDs already present
              add_multi = false; // Ensure later checks know we've found a duplicate and to not add the message

              if (a == 0 && split[a].length == 4) {
                // Match, first element of the array with no previous matches so we don't want a leading space
                message.msgno_parts = split[a] + "x2";
              } else if (split[a].length == 4) {
                // Match, not first element, and doesn't have previous matches
                message.msgno_parts += " " + split[a] + "x2";
              } else if (a == 0) {
                // Match, first element of the array so no leading space, has previous other matches so we increment the counter
                let count = parseInt(split[a].substring(5)) + 1;
                message.msgno_parts = split[a].substring(0, 4) + "x" + count;
              } else {
                // Match, has previous other matches so we increment the counter
                let count = parseInt(split[a].substring(5)) + 1;
                message.msgno_parts +=
                  " " + split[a].substring(0, 4) + "x" + count;
              }
            } else {
              // No match, re-add the MSG ID to the parent message
              if (a == 0) {
                message.msgno_parts = split[a];
              } else {
                message.msgno_parts += " " + split[a];
              }
            }
          }
        }

        message.timestamp = new_msg.timestamp;

        if (add_multi) {
          // Multi-part message has been found
          if (message.text && "text" in new_msg)
            // If the multi-part parent has a text field and the found match has a text field, append
            message.text += new_msg.text;
          else if ("text" in new_msg)
            // If the new message has a text field but the parent does not, add the new text to the parent
            message.text = new_msg.text;

          if ("msgno_parts" in message) {
            // If the new message is multi, with no dupes found we need to append the msg ID to the found IDs
            message.msgno_parts += " " + new_msg.msgno;
          } else {
            message.msgno_parts = message.msgno + " " + new_msg.msgno;
          }

          // Re-run the text decoder against the text field we've updated
          let decoded_msg = this.lm_md.decode(message);
          if (decoded_msg.decoded == true) {
            message["decoded_msg"] = decoded_msg;
          }
        }
        break;
      }

      if (rejected) {
        // Promote the message back to the front
        this.planes[index].messages!.forEach((item: any, i: number) => {
          if (i == this.planes[index].messages!.indexOf(message)) {
            this.planes[index].messages!.splice(i, 1);
            this.planes[index].messages!.unshift(item);
          }
        });
        break;
      }
    }
    return move_or_delete_id;
  }

  check_for_dup(message: acars_msg, new_msg: acars_msg): boolean {
    return Object.values(this.msg_tags).every((tag) => {
      if (tag in message && tag in new_msg) {
        if (message[tag] == new_msg[tag]) return true;
      } else if (!(tag in message) && !(tag in new_msg)) {
        return true;
      }
      return false;
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
    let plane_index = undefined;
    Object.values(this.planes).every((plane, index) => {
      if (callsign && plane.callsign === callsign) {
        plane_index = index;
        return false;
      }
      if (hex && plane.hex === hex) {
        plane_index = index;
        return false;
      }
      if (tail && plane.tail === tail) {
        plane_index = index;
        return false;
      }
      return true;
    });

    return plane_index;
  }

  get_callsign_from_adsb(plane: adsb_plane): string {
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

  get_callsign_from_acars(msg: acars_msg): string | undefined {
    if (msg.icao_flight) return msg.icao_flight;
    return undefined;
  }

  get_hex_from_acars(msg: acars_msg): string | undefined {
    if (msg.icao_hex) return msg.icao_hex;
    return undefined;
  }

  get_tail_from_acars(msg: acars_msg): string | undefined {
    if (msg.tail) return msg.tail;
    return undefined;
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

  get_tail_from_adsb(plane: adsb_plane): string {
    return plane.r
      ? plane.r.replace("-", "").replace(".", "").replace("~", "")
      : <any>undefined;
  }

  get_hex_from_adsb(plane: adsb_plane): string {
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
