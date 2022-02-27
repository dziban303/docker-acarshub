import { acars_msg, alert_terms } from "src/interfaces";

export class AlertHandler {
  current_terms: alert_terms | undefined = undefined;
  constructor() {
    this.current_terms = {} as alert_terms;
  }

  set_terms(alerts: alert_terms | undefined): void {
    if (alerts) this.current_terms = alerts;
  }

  find_alerts(acars_message: acars_msg): Array<string> {
    if (!acars_message) {
      console.error("Blank Message. Skipping alert matching");
      return [];
    }

    if (!this.current_terms) {
      console.error("No Alert Terms. Skipping alert matching");
      return [];
    }

    if (acars_message.text) {
      // first make sure we shouldn't ignore this

      const should_not_ignore = this.current_terms.ignore.every((term) => {
        // TODO: fix TS !
        return (
          acars_message
            .text!.toUpperCase()
            .search(new RegExp("\\b" + term.toUpperCase() + "\\b")) == -1
        );
      });

      if (should_not_ignore) {
        let matches: Array<string> = [];

        this.current_terms.text_terms.forEach((term) => {
          // TODO: fix TS !
          if (
            acars_message
              .text!.toUpperCase()
              .search(new RegExp("\\b" + term.toUpperCase() + "\\b")) != -1
          ) {
            matches.push(term);
          }
        });
        return matches;
      }
    }
    return [];
  }
}
