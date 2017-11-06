/* 
 * A lot of the decisions made in this code
 * are for performance reasons, assumed to be
 * run exclusively on Chrome.
 */

(function rightClickSelectionPreserver() {
  // Using integer constants rather than strings to track events.
  const MOUSEDOWN_EVENT_ID       = 1;
  const SELECTIONCHANGE_EVENT_ID = 2;
  const MOUSEUP_EVENT_ID         = 3;
  const CLICK_EVENT_ID           = 4;
  var lastSelectionRange = new Range();
  const loggedEventIds = {
    // Using this object as a static "struct" singleton,
    // which V8 creates *AS* a struct, not a hash.
    first:  0,
    second: 0,
    third:  0,
    fourth: 0,
    log(eventId) {
      // using the most minimal amount of statements
      // to juggle values, versus array manip which may GC refs.
      this.first  = this.second;
      this.second = this.third;
      this.third  = this.fourth;
      this.fourth = eventId;
    }
  };
  function saveSelection() {
    const selection = window.getSelection();
    if (selection.toString() == "")
      loggedEventIds.log(SELECTIONCHANGE_EVENT_ID);
    else
      lastSelectionRange = selection.getRangeAt(0);
  }
  function recallSelection() {
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(lastSelectionRange);
  }
  function handleContextMenu() {
    // Using simple boolean short-circuited integer value comparison.
    let {first, second, third, fourth} = loggedEventIds;
    if (first  == SELECTIONCHANGE_EVENT_ID &&
        second == MOUSEDOWN_EVENT_ID &&
        third  == SELECTIONCHANGE_EVENT_ID &&
        fourth == MOUSEUP_EVENT_ID)
      recallSelection();
  }

  try {
    document.addEventListener('mousedown',        e => loggedEventIds.log(MOUSEDOWN_EVENT_ID));
    document.addEventListener('selectionchange',  saveSelection);
    document.addEventListener('mouseup',          e => loggedEventIds.log(MOUSEUP_EVENT_ID));
    document.addEventListener('click',            e => loggedEventIds.log(CLICK_EVENT_ID));
    document.addEventListener('contextmenu',      handleContextMenu);
  } catch (e) {
    console.log("Failed to load Right Click Selection Preserver: " + e);
  }
})();
