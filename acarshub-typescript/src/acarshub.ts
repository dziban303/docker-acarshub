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
  system_status,
  html_msg,
  decoders,
  signal,
  alert_term,
  signal_freq_data,
  signal_count_data,
  adsb,
  alert_terms,
  LiveMessagesPage,
  SettingsPage,
} from "./interfaces";

// CSS loading

import "jquery";

import "./css/leaftlet.legend.css";
import "leaflet/dist/leaflet.css";
import "jbox/dist/jBox.all.css";
import "./css/site.css";

import { io, Socket } from "socket.io-client";
import { MessageHandler } from "./data-handling/message_handler";
import { faWindowRestore } from "@fortawesome/free-regular-svg-icons";
import { Settings } from "./data-handling/settings";

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
let live_messages_page: LiveMessagesPage | undefined = undefined;
const settings = new Settings();
let current_page: string | null = null;
let settings_page: SettingsPage | undefined = undefined;

$(async (): Promise<void> => {
  await detect_url();
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

      // FIXME: Remove this false check. ADSB is shut off to reduce problem space for now
      if (false && !adsb_interval) {
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
    const delete_id = msg_handler.acars_message(msg.msghtml);
    // If the message is a new message, then we need to update the page.
    if (
      msg.done_loading === true &&
      current_page === "live_messages" &&
      live_messages_page
    ) {
      live_messages_page.update_page(msg_handler.get_all_messages());
    } else if (
      typeof msg.done_loading === "undefined" &&
      current_page === "live_messages" &&
      live_messages_page
    ) {
      live_messages_page.update_page(msg_handler.get_message_by_id(delete_id));
    }
  });
  // signal level graph
  socket.on("signal", function (msg: signal): void {
    // stats_page.signals(msg);
  });

  socket.on("terms", function (msg: alert_terms): void {
    msg_handler.set_alerts(msg);
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

  if (current_page === "live_messages" && live_messages_page) {
    live_messages_page.set_page_active();
    live_messages_page.update_page(undefined);
  } else if (current_page === "settings" && settings_page) {
    settings_page.set_page_active();
    settings_page.update_page();
  }

  load_all_pages();
});

async function detect_url() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const url = urlParams.get("page");
  $(".sidebar-list-item").removeClass("active");
  if (url && url !== "live_messages") {
    if (url == "settings") {
      const { SettingsPage } = await import("./pages/settings_page");
      settings_page = new SettingsPage();
      current_page = "settings";
      $("#settings_link").addClass("active");
    }
  } else {
    const { LiveMessagesPage } = await import("./pages/live_messages_page");
    live_messages_page = new LiveMessagesPage();
    current_page = "live_messages";
    $("#live_messages_link").addClass("active");
  }
}

async function load_all_pages() {
  if (!live_messages_page) {
    const { LiveMessagesPage } = await import("./pages/live_messages_page");
    live_messages_page = new LiveMessagesPage();
  }

  if (!settings_page) {
    const { SettingsPage } = await import("./pages/settings_page");
    settings_page = new SettingsPage();
  }
}

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

export function get_setting(key: string): string {
  return settings.get_setting(key);
}

// register window handlers for callback to the correct object

window.nav_left = (uid: string): void => {
  if (!uid) return;

  msg_handler.update_selected_tab(uid);
  if (live_messages_page)
    live_messages_page.update_page_in_place(msg_handler.get_message_by_id(uid));
};

window.nav_right = (uid: string): void => {
  if (!uid) return;

  msg_handler.update_selected_tab(uid, "right");
  if (live_messages_page)
    live_messages_page.update_page_in_place(msg_handler.get_message_by_id(uid));
};

window.sidebar_nav_link = (
  page_id: string | undefined = undefined,
  push_state = true
): void => {
  if (!page_id) {
    const urlParams = new URLSearchParams(window.location.search);
    page_id = urlParams.get("page") || "live_messages";
  }

  let index_acars_path = document.location.pathname.replace(
    /about|search|stats|status|alerts|adsb/gi,
    ""
  );
  index_acars_path += index_acars_path.endsWith("/") ? "" : "/";
  let params = "";
  let title = "";
  $(".sidebar-list-item").removeClass("active");
  if (page_id === undefined || page_id === "live_messages") {
    current_page = "live_messages";
    if (live_messages_page) {
      live_messages_page.set_page_inactive();
      live_messages_page.set_page_active();
      live_messages_page.update_page(msg_handler.get_all_messages());
      $("#live_messages_link").addClass("active");
      params = "?page=live_messages";
      title = "Live Messages";
    }
  } else if (page_id === "settings") {
    current_page = "settings";
    if (settings_page) {
      settings_page.set_page_inactive();
      settings_page.set_page_active();
      settings_page.update_page();
      $("#settings_link").addClass("active");
      params = "?page=settings";
      title = "ACARS Hub: Settings";
    }
  }

  if (push_state)
    window.history.pushState(
      { page: index_acars_path + params },
      title,
      index_acars_path + params
    );
};

$(window).on("popstate", (): void => {
  window.sidebar_nav_link(undefined, false);
});
