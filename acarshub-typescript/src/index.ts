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

// import 'bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
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

let msg_handler = new MessageHandler();

$((): void => {
  index_acars_path += index_acars_path.endsWith("/") ? "" : "/";
  index_acars_url = document.location.origin + index_acars_path;
  socket = io(`${document.location.origin}/main`, {
    path: index_acars_path + "socket.io",
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
