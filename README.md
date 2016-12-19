# Calendar Day View


Pulls Data from [link](https://appcues-interviews.firebaseio.com/calendar/events.json) and formats on a daily view agenda

The **LayOutDay** function that takes in the JSON object and returns a object with the way it should be formatted returns the start, end, width, height, and left to make printing to the screen as seamless as possible. The start is synonymous with the top so I did not see the point in duplicating that information. First, it loops through all minutes of the day and all events to determine overlapping events and tracks all overlapping events in the _concurrentEvents_ array and tracks the highest number of concurrent events in the _maxConcurrent_ array. This only tracks the maximum for each event and without further processing, all events at any given time may not be the same width, so it loops through all events twice to make sure to update all events _if it only loops once, the first few events don't get updated with the later updates_. Finally, it loops through all events to set the height, width, and left values to be printed to the printed to the screen.

To view the final result open **index.html** index.html</a>. You will need internet access to reach the JSON, or the link can be changed on the first line of **/js/index.js**. 


![Demo layout](./images/screenshot.png)
 _The times in the gist don't quite line up with the times provided in the JSON_


###### Not sure if
![not sure if](https://media.giphy.com/media/3ornka9rAaKRA2Rkac/giphy.gif)  
