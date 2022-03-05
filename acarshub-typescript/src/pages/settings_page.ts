import { Page } from "./pages";

export class SettingsPage extends Page {
  constructor() {
    super("Settings");
  }

  set_page_active() {
    this.update_title_bar();
  }

  update_page() {
    $(this.content_area).html("Settings and shit");
  }
}
