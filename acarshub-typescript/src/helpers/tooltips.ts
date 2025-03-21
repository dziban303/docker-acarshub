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

import jBox from "jbox";

export let tooltip = {
  freq_tooltip: new jBox("Mouse", {
    title: "Frequency",
    content: "The frequency this message was received on",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  ground_tooltip: new jBox("Mouse", {
    title: "Ground",
    content: "Is the aircraft on the ground?",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  tail_tooltip: new jBox("Mouse", {
    title: "Tail",
    content: "The tail number of the plane",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  flight_tooltip: new jBox("Mouse", {
    title: "Aircraft Callsign",
    getContent: "data-jbox-content",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  icao_tooltip: new jBox("Mouse", {
    title: "ICAO Value",
    content: "The ICAO value assigned to the aircraft",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  level_tooltip: new jBox("Mouse", {
    title: "Signal Level",
    getContent: "data-jbox-content",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  ack_tooltip: new jBox("Mouse", {
    title: "Acknowledgement",
    content:
      "A flag to indicate if the message is, or requires, an acknolwedgement.",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  mode_tooltip: new jBox("Mouse", {
    title: "Mode",
    content: "A flag to indicate the mode of the message.",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  blockid_tooltip: new jBox("Mouse", {
    title: "Block ID",
    content: "A flag to indicate the block-id of the message.",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  msgno_tooltip: new jBox("Mouse", {
    title: "Message Number",
    content:
      "A flag to indicate the message-number. This is used in a series of messages that the receiver is meant to combine together, and the order they should be put in.",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  response_tooltip: new jBox("Mouse", {
    title: "Response",
    content: "A flag to indicate if the message is, or requires, a response.",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  error_tooltip: new jBox("Mouse", {
    title: "Error",
    content: "A flag to indicate if the message had any errors in decoding.",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  toggle_acars: new jBox("Tooltip", {
    title: "Toggle ACARS",
    content:
      "Toggle between showing all ADSB targets and only those with ACARS messages",
    closeOnMouseleave: true,
    adjustTracker: true,
    delayOpen: 500,
    position: {
      x: "left",
      y: "center",
    },
    outside: "xy",
  }),

  toggle_datablocks: new jBox("Tooltip", {
    title: "Toggle Data Blocks",
    content:
      "Toggle between showing data blocks on the map and turning them off",
    closeOnMouseleave: true,
    adjustTracker: true,
    delayOpen: 500,
    position: {
      x: "left",
      y: "center",
    },
    outside: "xy",
  }),

  toggle_extended_datablocks: new jBox("Tooltip", {
    title: "Toggle Extended Data Blocks",
    content: "Toggle extra information on/off in the data blocks",
    closeOnMouseleave: true,
    adjustTracker: true,
    delayOpen: 500,
    position: {
      x: "left",
      y: "center",
    },
    outside: "xy",
  }),

  toggle_unread: new jBox("Tooltip", {
    title: "Toggle Unread Messages",
    content:
      "Toggle the count of unread messages for each plane in the sidebar",
    closeOnMouseleave: true,
    adjustTracker: true,
    delayOpen: 500,
    position: {
      x: "left",
      y: "center",
    },
    outside: "xy",
  }),

  toggle_markallread: new jBox("Tooltip", {
    title: "Mark Unread Messages as Read",
    content: "Mark all messages as read",
    closeOnMouseleave: true,
    adjustTracker: true,
    delayOpen: 500,
    position: {
      x: "left",
      y: "center",
    },
    outside: "xy",
  }),

  datablock: new jBox("Mouse", {
    getContent: "data-jbox-content",
    id: "airplane",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "right",
      y: "bottom",
    },
  }),

  release_version: new jBox("Mouse", {
    getContent: "data-jbox-content",
    id: "version",
    closeOnMouseleave: true,
    adjustTracker: true,
    position: {
      x: "left",
      y: "top",
    },
  }),

  // Function to close all open tool tips. This is needed so that when the page updates tooltips aren't just chilling randomly

  close_all_tooltips: function (): void {
    this.freq_tooltip.close();
    this.ground_tooltip.close();
    this.tail_tooltip.close();
    this.flight_tooltip.close();
    this.icao_tooltip.close();
    this.level_tooltip.close();
    this.ack_tooltip.close();
    this.mode_tooltip.close();
    this.blockid_tooltip.close();
    this.msgno_tooltip.close();
    this.response_tooltip.close();
    this.error_tooltip.close();
    this.toggle_acars.close();
    this.toggle_datablocks.close();
    this.toggle_extended_datablocks.close();
    this.toggle_unread.close();
    this.toggle_markallread.close();
    this.datablock.close();
    //this.release_version.close();
  },

  // Function to attach all of the tooltips to the new elements on the page

  attach_all_tooltips: function (): void {
    this.freq_tooltip.attach($(".freq-tooltip"));
    this.ground_tooltip.attach($(".ground-tooltip"));
    this.tail_tooltip.attach($(".tail-tooltip"));
    this.flight_tooltip.attach($(".flight-tooltip"));
    this.icao_tooltip.attach($(".icao-tooltip"));
    this.level_tooltip.attach($(".level-tooltip"));
    this.ack_tooltip.attach($(".ack-tooltip"));
    this.mode_tooltip.attach($(".mode-tooltip"));
    this.blockid_tooltip.attach($(".blockid-tooltip"));
    this.msgno_tooltip.attach($(".msgno-tooltip"));
    this.response_tooltip.attach($(".response-tooltip"));
    this.error_tooltip.attach($(".error-tooltip"));
    this.toggle_acars.attach($(".toggle-acars"));
    this.toggle_datablocks.attach($(".toggle-datablocks"));
    this.toggle_extended_datablocks.attach($(".toggle-extended-datablocks"));
    this.toggle_unread.attach($(".toggle-unread-messages"));
    this.toggle_markallread.attach($(".mark-all-messages-read"));
    this.datablock.attach($(".datablock"));
    this.release_version.attach($("#release_version"));
  },

  cycle_tooltip: function (): void {
    this.close_all_tooltips();
    this.attach_all_tooltips();
  },
};
