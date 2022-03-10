import { get_alerts } from "../acarshub";
import { acars_msg } from "src/interfaces";

export class AlertHandler {
  constructor() {}

  find_alerts(acars_message: acars_msg): Array<string> {
    const current_terms = get_alerts();
    if (!acars_message) {
      console.error("Blank Message. Skipping alert matching");
      return [];
    }

    if (!current_terms) {
      console.error("No Alert Terms. Skipping alert matching");
      return [];
    }

    if (acars_message.text) {
      // first make sure we shouldn't ignore this

      const should_not_ignore = current_terms.ignore.every((term) => {
        // TODO: fix TS !
        return (
          acars_message
            .text!.toUpperCase()
            .search(new RegExp("\\b" + term.toUpperCase() + "\\b")) == -1
        );
      });

      if (should_not_ignore) {
        let matches: Array<string> = [];

        current_terms.text_terms.forEach((term) => {
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
