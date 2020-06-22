# s2g

## log

### 5/23/20


What is a minimal blank app? It should...
* have dev and prod modes, be able to deploy
* have a basic redux like thing
* have at least 3 pages that display on laptop or phone. When one is active the others react to what happens and display the correct url.
* move img and css from code to dist and prod
* divide state so differ ent pages have their own slice of state

example: clist.json app

*  <s>that an app keeps its undone lists in local storage so it pops ups fast. </s>
*  one page list all the different list types and maybe how many things on each list
*  another page has the current list. When you add an item it makes a fetch to the db as you type, adds it right away and then messages every subscribed user with that data.
*  when you get a message you either add an item or find it and remove it
* so the database contains every item ever added/edited unique on name 
* on a app startup it downloads everything not done. Once it starts up it connects to socketio for that list, then it waits for messages. If a socketio connection is lost, then it causes a full fetch of the list. 
* the server also responds to messages peeling off whatever comes in to the server and uodating the database. 
* clicking on the list types page downloads a new lsit and 
* if one client is offline they get the current list when they reconnect
* if multiple clients send messages they are dealt with in the order received
* how do you add, delete, join or resign from a list
* what does authentication look like? If no localstorage then register. Returning from registration either gives you a new name with no lists or 

questions to test

* does it take too long to guess ahead? You could always just add it raw then send a message that grabs the xtra data from the server (then modifies the message on the way to other clients)
* should it be a pwa?
* autocomplete from server? too slow?