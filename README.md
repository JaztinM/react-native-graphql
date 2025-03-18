GraphQl Queries here use https://cors-anywhere.herokuapp.com/ as proxy server since backend doesnt allow localhost hostname
visit https://cors-anywhere.herokuapp.com/corsdemo to make the apis work or modify apolloClient.ts in scripts and use different proxy address

The app uses file-based routing and the folders are inside the app folder

-_layout: contains wrappers and routing for the app

-index.tsx is the file for rendering the index/starting page, index page consist of login/register page. Those react components are in login and register folder.
     note: login and register api in backend is currently not working so I made some alternative code just to simulate login and and the current users of the app

-Logging in with username '1' and random passwords will make you user with id: 1,

-home: user needs to login first to go here, home displays all the messages the user has. Clicking on a message will navigate user to message screen
    -home gets all the users that current user has messages with then gets their latest message. Subscriptions are also triggered for each user here to fetch  incoming new messages, and updates the messages for that specific user. new messages are highlighted in home.

    -search bar: makes you search for user to chat, must edit the hardcoded user id also in home to add/delete users
    -logout button: logs you out of the app and delete the data in local storage such as the token

-messages: displays messages from and to a user, you can also send message here
    -contains graphql query to get recent messages from and to the user, this is the same query in home so this doesnt get triggered again if its already fetched

other folders
-components: has initial files after creating the boilerplate
-scripts: contains some scripts like the graphQl apolloClient instance
-utils: contains some utility functions like authentication function for checking if the user is logged in, and also the graphQl mutation schemas
-types: contains interfaces/types for type checking

-app has token based authentication and prevents user from going to protected routes if they are not logged in, if user is logged in, they are automatically redirected to /home


