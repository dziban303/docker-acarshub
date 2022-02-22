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

import { acars_msg, plane } from "src/interfaces";
import {
  generate_messages_html_from_planes,
  generate_message_group_html_from_plane,
} from "../processing/message_html_generator";
import { Page } from "./pages";

export class LiveMessagesPage extends Page {
  current_message_string: string = "";

  constructor() {
    super("Live Messages");
    $(this.content_area).html("Welcome to ACARS Hub. Waiting for data...");
  }
  update_page(planes: plane[] | undefined = undefined) {
    if (!planes) {
      $(this.content_area).html("No data received yet.");
      return;
    }

    if (this.current_message_string) {
      $(`#${planes[0].uid}_container`).remove();

      // Display the new message at the front of the DOM tree
      $(this.content_area).prepend(
        generate_message_group_html_from_plane(planes[0])
      );
      // After updating the tree we may exceed the length. If so, remove the last element

      while (
        $(`${this.content_area} div.acars_message_container`).length > 20
      ) {
        $(".acars_message_container:last").remove();
      }
      // Save the DOM tree HTML because this is a hacky hack to get the page refreshed on page in
      this.current_message_string = $(this.content_area).html();
    } else {
      // This is a new load and we need to populate the DOM tree
      this.current_message_string = generate_messages_html_from_planes(planes);
      //   this.current_message_string = display_messages(
      //     this.lm_msgs_received.get_all_messages(),
      //     this.selected_tabs,
      //     true
      //   );
      $(this.content_area).html(this.current_message_string);
    }
  }
}
