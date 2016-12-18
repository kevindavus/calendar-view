const eventURL =
  "https://appcues-interviews.firebaseio.com/calendar/events.json";
/**
 * Lays out events for a single day
 *
 * @param array  events   An array of event objects. Each event object consists of a start and end
 *                        time  (measured in minutes) from 9am, as well as a unique id. The
 *                        start and end time of each event will be [0, 720]. The start time will
 *                        be less than the end time.
 *
 * @return array  An array of event objects that has the width, the left and top positions set, in addition to the id,
 *                start and end time. The object should be laid out so that there are no overlapping
 *                events.
 *
 * function layOutDay(events) {...}
 */
function layOutDay(events) {
  //indices of all overlapping events
  let concurrentEvents = [];
  //max number at any one time for each event
  let maxConcurrent = [];
  let horizOrder = [];
  let keys = Object.keys(events); //id of each event

  // loop through each event
  for (let idx = 0; idx < keys.length; idx++) {
    //max number of concurrent events for this event
    let maxInRow = 1;
    concurrentEvents.push([]);
    // loop through each minute of calendar
    for (let i = 0; i <= 720; i++) {
      // how many events are during this minute
      let numInRow = 1;
      //loop through all other elements with respect to first and the given time
      for (let idx2 = 0; idx2 < keys.length; idx2++) {
        let isConcurrent = false;
        if (idx != idx2) {
          //check if given minute is within the bounds of both events
          if ((events[keys[idx]].start <= i) && (events[keys[idx]].end >=
              i) &&
            (events[keys[idx2]].start <= i) && (events[keys[idx2]].end >=
              i)) {
            //if the event is not already accounted for in conccurent event array, add it
            if (!concurrentEvents[idx].includes(idx2)) {
              numInRow++;
              concurrentEvents[idx].push(idx2);
            }
          }
        }
        //keep max number of concurrent events up to date
        if (numInRow > maxInRow) {
          maxInRow = numInRow;
        }
      }
    }
    maxConcurrent.push(maxInRow);
  }

  //loop through events twice to make sure widths of concurrent events will be equal
  let reset = true;
  let count = 0;
  while (count < 2) {
    for (let i = 0; i < keys.length; i++) {
      for (let j = concurrentEvents[i].length - 1; j >= 0; j--) {
        if (keys[i] == "test1") {
          console.log(concurrentEvents[i][j]);
          console.log("test1: " + maxConcurrent[0]);
        }
        if (maxConcurrent[concurrentEvents[i][j]] > maxConcurrent[i]) {
          maxConcurrent[i] = maxConcurrent[concurrentEvents[i][j]];
        } else {
          maxConcurrent[concurrentEvents[i][j]] = maxConcurrent[i];
        }
      }
    }
    count++;
  }
  //one final loop to set the pixel values for each event
  for (let i = 0; i < keys.length; i++) {
    horizOrder.push(-1);
    events[keys[i]].width = 600 / maxConcurrent[i];
    events[keys[i]].height = events[keys[i]].end - events[keys[i]].start;
    for (let k = 0; k < maxConcurrent[i]; k++) {
      let isTaken = false;
      for (let j = 0; j < concurrentEvents[i].length; j++) {
        let crossCheck = concurrentEvents[i][j];
        if (typeof (horizOrder[crossCheck]) != "undefined") {
          if (horizOrder[crossCheck] == k) {
            isTaken = true;
          }
        }
      }
      if (isTaken === false) {
        horizOrder[i] = k;
        events[keys[i]].left = k * (600 / maxConcurrent[i]);
      }
    }
  }
  return events;

}
let request = $.ajax({
  url: eventURL,
});

request.done(function (data) {
  //retrieve formatting
  let events = layOutDay(data);
  for (let key in events) {
    let item = events[key];
    //use objet properties to print out to screen
    $(".agenda").append(
      "<div class='event' style='min-width:" + item.width + "px !important;  max-width:" + item.width + "px !important; margin-left:" +
      item.left + "px; margin-top:" + item.start +
      "px; height:" + item.height +
      "px;'><h1>Sample Event</h1><p>Sample Location</p></div>");
  }
});
request.fail(function () {
  $(document).innerHTML = 'There has been an error in retrieving the agenda information';
});
$(document).ready(function () {
  let topOfHour = true;
  for (let i = 0; i <= 720; i += 30) {
    let isMorning = i < 180;
    let hour = Math.floor((i / 60) + 9) % 12;
    if (hour === 0) {
      hour = 12;
    }
    let outTime;
    if (topOfHour) {
      outTime = "<p class='time'> <span class='time-top'>" + hour + ":00</span>";
      if (isMorning) {
        outTime += " AM</p>";
      } else {
        outTime += " PM</p>";
      }
    } else {

      outTime = "<p class='time time-half'>" + hour + ":30</p>";
    }
    $('.times').append(outTime);
    //alternate between :00 and :30
    topOfHour = !topOfHour;
  }
});
