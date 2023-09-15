# RoutePlanner
## Steps to run
- Log in and Create an API key here : https://www.bingmapsportal.com/Application
- Replace the variable API_KEY in index.js
- In this line in index.html
  '<script type='text/javascript'
            src='http://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=' 
            async defer></script>'
  paste your key
- Open index.html in a browser
- In the console run calculateRoute(17.434940, 78.476239,30,10,10) to get a sample route around Necklace Road
