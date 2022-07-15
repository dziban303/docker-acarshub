import { get_all_settings, get_display_settings } from "../acarshub";
import { LocalStorageSettings } from "src/interfaces";
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
