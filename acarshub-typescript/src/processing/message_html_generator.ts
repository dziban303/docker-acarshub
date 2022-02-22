// Copyright (C) 2022 Frederick Clausen II
// This file is part of acarshub <https://github.com/sdr-enthusiasts/docker-acarshub>.

import { acars_msg, plane } from "src/interfaces";

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

export function generate_messages_html_from_planes(
  planes: plane[] | undefined = undefined
): string {
  let output: string = "";
  if (typeof planes === "undefined" || planes.length === 0) {
    console.error("No planes. Nothing to display.");
    return "";
  }

  planes.forEach((plane) => {
    if (typeof plane !== "undefined") {
      output += generate_message_group_html_from_plane(plane);
    }
  });

  return output;
}

export function generate_message_group_html_from_plane(
  planes: plane | undefined = undefined
): string {
  if (!planes || planes.messages.length === 0) {
    console.error("No messages. Nothing to display.");
    return "";
  }

  let output = `<div id="${planes.uid}_container" class="acars_message_container">`;

  planes.messages.every((message) => {
    if (message.uid == planes.selected_tab) {
      output += generate_message_html(planes, message);
      return false;
    }
    return true;
  });

  output += "</div>";

  return output;
}

function generate_message_html(
  planes: plane,
  acars_message: acars_msg
): string {
  let output = "";
  // TODO: from_addr may be the ICAO Hex of the plane....investigate

  output += `<div class="acars_message">`;
  output += message_top_row(acars_message);
  output += generate_message_body(acars_message);
  output += generate_footer(planes, acars_message);
  output += `</div>`;

  return output;
}

function message_top_row(acars_message: acars_msg): string {
  let output = "";

  // Pre process any fields that need some magic

  let timestamp = undefined;
  if (has_field(acars_message, "timestamp"))
    timestamp = new Date(acars_message.timestamp * 1000);
  else
    timestamp = new Date(
      (typeof acars_message.msg_time !== "undefined"
        ? acars_message.msg_time
        : 0) * 1000
    );

  output += `<div class="acars_message_row">`;
  output += `<div class="message_from"><strong>${acars_message.message_type}</strong> from <strong>${acars_message.station_id}</strong></div>`;
  output += `<div class="message_time"><strong>${timestamp}</strong></div>`;
  output += "</div>";

  return output;
}

function generate_message_body(acars_message: acars_msg): string {
  let output = "";

  output += `<div class="acars_message_row">`;
  output += `<div class="message_body">`;
  if (has_field(acars_message, "duplicates")) {
    output += `<strong>Duplicates received:</strong> ${acars_message.duplicates}<br>`;
  }

  if (has_field(acars_message, "msgno_parts")) {
    output += `<strong>Message Parts:</strong> ${acars_message.msgno_parts}<br>`;
  }

  if (has_field(acars_message, "label")) {
    output += `<strong>Message Label:</strong> ${acars_message.label}${
      has_field(acars_message, "label_type")
        ? " (" + acars_message.label_type + ")"
        : ""
    }<br>`;
  }

  if (has_field(acars_message, "toaddr")) {
    output += `<strong>To Address:</strong> ${acars_message.toaddr}/${
      has_field(acars_message, "toaddr_hex") ? acars_message.toaddr_hex : "?"
    }<br>`;
  }

  if (has_field(acars_message, "toaddr_decoded")) {
    output += `<strong>To Address Station ID:</strong> ${acars_message.toaddr_decoded}<br>`;
  }

  if (has_field(acars_message, "fromaddr")) {
    output += `<strong>From Address:</strong> ${acars_message.fromaddr}/${
      has_field(acars_message, "fromaddr_hex")
        ? acars_message.fromaddr_hex
        : "?"
    }<br>`;
  }

  if (has_field(acars_message, "fromaddr_decoded")) {
    output += `<strong>From Address Station ID:</strong> ${acars_message.fromaddr_decoded}<br>`;
  }

  if (has_field(acars_message, "depa")) {
    output += `<strong>Departure Airport:</strong> ${acars_message.depa}<br>`;
  }

  if (has_field(acars_message, "dsta")) {
    output += `<strong>Destination Airport:</strong> ${acars_message.dsta}<br>`;
  }

  if (has_field(acars_message, "eta")) {
    output += `<strong>Estimated Arrival Time:</strong> ${acars_message.eta}<br>`;
  }

  if (has_field(acars_message, "gtout")) {
    output += `<strong>Pushback from gate:</strong> ${acars_message.gtout}<br>`;
  }

  if (has_field(acars_message, "gtin")) {
    output += `<strong>Arrived at gate:</strong> ${acars_message.gtin}<br>`;
  }

  if (has_field(acars_message, "wloff")) {
    output += `<strong>Takeoff from runway:</strong> ${acars_message.wloff}<br>`;
  }

  if (has_field(acars_message, "wlin")) {
    output += `<strong>Landed at runway:</strong> ${acars_message.wlin}<br>`;
  }

  if (has_field(acars_message, "lat")) {
    output += `<strong>Latitude:</strong> ${acars_message.lat?.toLocaleString(
      undefined,
      { maximumFractionDigits: 2, minimumFractionDigits: 2 }
    )}<br>`;
  }

  if (has_field(acars_message, "lon")) {
    output += `<strong>Longitude:</strong> ${acars_message.lon?.toLocaleString(
      undefined,
      { maximumFractionDigits: 2, minimumFractionDigits: 2 }
    )}<br>`;
  }

  if (has_field(acars_message, "alt")) {
    // TODO: convert to meters if setting is set
    output += `<strong>Altitude:</strong> ${acars_message.alt?.toLocaleString()} Feet<br>`;
  }

  output += `<div class="text_fields">`;
  output += display_message_text(acars_message);
  output += `</div>`;

  output += `</div>`; // div for message body
  output += `</div>`; // div for message row
  return output;
}

function display_message_text(acars_message: acars_msg): string {
  let output = "";

  if (
    has_field(acars_message, "decodedText") ||
    has_field(acars_message, "text") ||
    has_field(acars_message, "data") ||
    has_field(acars_message, "libacars")
  ) {
    if (has_field(acars_message, "text")) {
      // TODO: fix TS !
      // TODO: highlight alert terms
      const text = acars_message.text!.replace("\\r\\n", "<br>");
      // output += `<p><strong>Message Text:</strong></p>`;
      output += `<div class="text_body"><p><strong>Message Text:</strong></p><div class="code">${text}</div></div>`;
    }

    if (has_field(acars_message, "decodedText")) {
      // output += `<p><strong>Decoded Text:</strong></p>`;
      output += `<div class="text_body"><p><strong>Decoded Text:</strong></p><div class="code">${loop_array(
        acars_message.decodedText.formatted
      )}</div></div>`;
    }

    if (has_field(acars_message, "data")) {
      // output += `<p><strong>Data:</strong></p>`;
      // TODO: fix TS !
      output += `<div class="text_body"><p><strong>Data:</strong></p><div class="code">${acars_message.data!.replace(
        "\\r\\n",
        "<br>"
      )}</div></div>`;
    }

    if (has_field(acars_message, "libacars")) {
      // output += `<p><strong>LibACARS Decoded Text:</strong></p>`;
      output += `<div class="text_body"><p><strong>LibACARS Decoded Text:</strong></p><div class="code">${acars_message
        .libacars!.replace("<pre>")
        .replace("</pre>")}</div></div>`;
    }
  }

  return output;
}

function generate_footer(planes: plane, acars_message: acars_msg): string {
  let output = `<div class="acars_row_footer">`;
  output += `<div class="acars_row_footer_left">`;
  output += `<strong>Plane:</strong> ${acars_message.icao}<br>`;
  output += `</div>`;
  output += `</div>`;
  return output;
}

function has_field(acars_message: acars_msg, field: string): boolean {
  // @ts-expect-error
  return (
    typeof acars_message[field] !== "undefined" && acars_message[field] !== ""
  );
}

function loop_array(input: any): string {
  let html_output: string = "";

  for (let m in input) {
    if (typeof input[m] === "object") {
      html_output += loop_array(input[m]);
    } else {
      if (m === "label") html_output += input[m] + ": ";
      else if (m === "value") {
        html_output += input[m] + "<br>";
      } else if (m === "description") {
        html_output += "Description: " + input[m] + "<br>";
      }
    }
  }

  return html_output;
}
