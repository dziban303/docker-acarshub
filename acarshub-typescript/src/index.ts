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

declare const window: any;

import {
  labels,
  system_status,
  html_msg,
  terms,
  database_size,
  current_search,
  search_html_msg,
  decoders,
  signal,
  alert_term,
  signal_freq_data,
  signal_count_data,
  adsb,
  window_size,
  alert_matched,
  plane_data,
  acars_msg,
  plane_match,
  acarshub_version,
} from "./interfaces";

// CSS loading

import "jquery";

import "./css/leaftlet.legend.css";
import "leaflet/dist/leaflet.css";
import "jbox/dist/jBox.all.css";
import "./css/site.css";

import { io, Socket } from "socket.io-client";
import { MessageHandler } from "./processing/message_handler";

let socket: Socket = <any>null;
let socket_status: boolean = false;

let index_acars_url: string = "";
let index_acars_path: string = "";
let index_acars_page: string = "";

let adsb_enabled = false;
let adsb_url: string = "";
let adsb_interval: any;
let adsb_getting_data: boolean = false;
let adsb_request_options = {
  method: "GET",
} as RequestInit;

let msg_handler = new MessageHandler();

$((): void => {
  const menuIconButton = document.querySelector("[data-menu-icon-btn]");
  const sidebar = document.querySelector("[data-sidebar]");

  if (menuIconButton && sidebar) {
    menuIconButton.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
  index_acars_path += index_acars_path.endsWith("/") ? "" : "/";
  index_acars_url = document.location.origin + index_acars_path;
  socket = io(`${document.location.origin}/main`, {
    path: index_acars_path + "socket.io",
  });

  socket.on("features_enabled", function (msg: decoders): void {
    adsb_url = index_acars_url + "data/aircraft.json";
    if (msg.adsb.enabled === true) {
      if (msg.adsb.bypass) {
        adsb_url = msg.adsb.url;
        adsb_request_options["mode"] = "cors";
      }

      // Check to see if the adsb interval already exists.
      // We want to do this because if the client disconnects it will
      // receive all of the 'on connect' data again, and another adsb interval
      // would be spawned.

      if (!adsb_interval) {
        update_adsb();
        adsb_interval = setInterval(() => {
          update_adsb();
        }, 5000);
      }
    } else {
      adsb_enabled = false;
    }

    // If for some reason ADSB was ever turned off on the back end and was enabled for the client, turn off the updater
    // And update the web app to remove menu and destroy costly background assets
    if (!msg.adsb.enabled && adsb_interval != null) {
      adsb_enabled = false;
      clearInterval(adsb_interval);
      adsb_interval = null;
    }
  });

  socket.on("acars_msg", function (msg: html_msg) {
    // New acars message.
    msg_handler.acars_message(msg.msghtml);
  });
  // signal level graph
  socket.on("signal", function (msg: signal): void {
    // stats_page.signals(msg);
  });

  // alert term graph
  socket.on("alert_terms", function (msg: alert_term): void {
    // stats_page.alert_terms(msg);
  });

  // sidebar frequency count
  socket.on("signal_freqs", function (msg: signal_freq_data): void {
    // stats_page.signal_freqs(msg);
  });

  socket.on("system_status", function (msg: system_status): void {
    // status.status_received(msg);
  });

  socket.on("signal_count", function (msg: signal_count_data): void {
    // stats_page.signal_count(msg);
  });

  // socket errors

  socket.on("disconnect", function (): void {
    // connection_good = false;
    // connection_status();
  });

  socket.on("connect_error", function (): void {
    // connection_good = false;
    // connection_status();
  });

  socket.on("connect_timeout", function (): void {
    // connection_good = false;
    // connection_status();
  });

  socket.on("connect", function (): void {
    // set_connection_good();
    // connection_status(true);
  });

  socket.on("reconnect", function (): void {
    // set_connection_good();
    // connection_status(true);
  });

  socket.on("reconnecting", function (): void {
    console.error("reconnecting");
  });

  socket.on("error", function (e): void {
    console.error(e);
  });
});

async function update_adsb(): Promise<void> {
  fetch(adsb_url, adsb_request_options)
    .then((response) => {
      adsb_getting_data = true;
      return response.json();
    })
    .then((planes) => msg_handler.adsb_message(planes as adsb))
    .catch((err) => {
      adsb_getting_data = false;
      console.error(err);
    });
}
