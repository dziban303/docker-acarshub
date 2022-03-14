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

import { get_all_settings, get_display_settings } from "../acarshub";
import { Page } from "./pages";

export class SettingsPage extends Page {
  constructor() {
    super("Settings");
  }

  set_page_active() {
    this.update_title_bar();
  }

  update_alerts() {
    const settings = get_all_settings();
    $(`#alerts_list_of_blacklist_terms`).val(
      settings.alerts_list_of_blacklist_terms
    );
    $(`#alerts_list_of_whitelist_terms`).val(
      settings.alerts_list_of_whitelist_terms
    );
  }

  update_page() {
    const settings = get_all_settings();
    const default_settings = get_display_settings();

    let output = `<div class="settings_container">`;
    default_settings.forEach((setting) => {
      const value =
        settings[setting.LocalStorageSettingPropertyName] ||
        setting.LocalStorageSettingPropertyDefault;
      let output_value = "";
      if (setting.LocalStorageSettingPropertyType == "boolean") {
        output_value = `<input type="checkbox" id="${
          setting.LocalStorageSettingPropertyName
        }" ${value ? "checked" : ""}>`;
      } else if (setting.LocalStorageSettingPropertyType == "number") {
        const min = setting.LocalStorageSettingPropertyNumberMin || 0;
        const max = setting.LocalStorageSettingPropertyNumberMax || 10;
        const step = setting.LocalStorageSettingPropertyNumberStep || 1;
        // TODO: This range function to ensure values fall within acceptable values feels kind of harsh
        // Maybe move this to a javascript event handler and debounce the input? Can we debounce input in this validator?
        // https://stackoverflow.com/questions/54980175/debounce-function-is-not-working-on-input-events
        output_value = `<input type="number" id="${setting.LocalStorageSettingPropertyName}" value="${value}" min="${min}" max="${max}" step="${step}" oninput="(!validity.rangeOverflow||(value=${max})) && (!validity.rangeUnderflow||(value=${min})) &&
            (!validity.stepMismatch||(value=parseInt(this.value)));">`;
      } else if (setting.LocalStorageSettingPropertyType == "string") {
        output_value = `<input type="text" id="${setting.LocalStorageSettingPropertyName}" value="${value}">`;
      } else if (setting.LocalStorageSettingPropertyType == "array") {
        output_value = `<input type="text" id="${setting.LocalStorageSettingPropertyName}" style="width: 100%" value="${value}">`;
      }
      output += `<div class="settings_row"><div class="setting_item_left"><label class="settings_label" for=${setting.LocalStorageSettingPropertyName}>${setting.LocalStorageSettingPropertyDisplayCategory}: ${setting.LocalStorageSettingPropertyDisplayName}</label></div><div class="setting_item_right">${output_value}</div></div>`;
    });

    output += `<div class="settings_row"><button type="button" class="btn btn-primary" id="save_settings" onclick="save_settings()">Save</button></div>`;
    // output += `</div>`;
    $(this.content_area).html(output);
  }
}
