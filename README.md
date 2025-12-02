# ChatOverlay
A local chat overlay for Twitch that doesn't partially cut off older chat messages if they not completely fit the chatbox. Can be used as a standalone web page and as a local file browser source in OBS. 
At the moment, the web page does not automatically scale with the window size. It's a fixed 600x600 chat box using the 56x56 sized emotes from Twitch, using Inter Medium and Inter Bold fonts for text at a 28px size. To change these, you need to edit the file. 
This program also requires setting up a developer application on Twitch and creating a token for it with chat:read permissions.

# Local Setup

1. Download the twitch_chat.html file somewhere on your computer. You'll also need the font files, Inter-Bold.woff2 and Inter-Medium.woff2, included in this repo. These are from https://github.com/rsms/inter, but you can use your own fonts. You will have to modify the css in the html file to change this. If you do use the provided fonts, make sure they're in the same folder as the html file.
2. Now open the html file in a text editor.
3. Scroll down to line 102 in the script section. Write your username inside the quotes
4. Go to line 114. If you're using this chat overlay for your own streams, type your username in the quotes here, again.
5. Now we need to setup the twitch developer application. Go here https://dev.twitch.tv/, click create an application. Log in if you need to. The page might redirect you back after login. Click the Your Console button in the top right. 
6. You should be sent to a developer dashboard. There should be a register your application button on the right side. Click it
7. Name it whatever you want.
8. In OAuth redirect urls, type http://localhost and add it
9. Put what you see fits in category. Maybe website integration.
10. After hitting create, I believe it should show you a client id and client secret. If it just redirects you to the dashboard, click manage for your application. All you need is the client id
11. Copy the client id, go back to the html file, and paste it in the quotes for client_id on line 106.
12. Now we need to setup a user access token. This is a token generated for your dev app with chat:read permissions. It lets anyone using this token to enter chatrooms under your account and read chat. That's it. It can't write messages or do anything but read the chat or query the twitch api for things that don't require permissions. Below is the link to generate that token. You have to replace the YOUR_CLIENT_ID part with your app's client_id. Don't remove the ampersand
https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost&scope=chat%3Aread


14. After you click the link and authorize it, you will be redirected to a page that doesn't exist, but your url bar will be updated with a new link. In the url bar, it should show #access_token=RANDOMTEXT&.Copy the text starting with the character after the equal sign and through the last character before the & symbol. If for whatever reason, you ever want to unauthorize this token. Go to https://www.twitch.tv/settings/connections and you'll find your dev application here. Disconnect that and it will invalidate the token.
15. In the html file, on line 110 for the token variable, paste this inside the quotes.
Save the file, and now you can open it in your web browser or OBS. To start the chat, you need to click the join button. To leave chat, you can exit or click LeaveChat. If you're using this in obs as a local file browser source, you will need to click interact for the browser source and manually hit the join button to start it. If this is an issue, I can make it automatically join on load. 

# StreamElements
Should currnently work without issues. If any issues are encountered, I recommend you use the standalone version and not use streamelements. Streamelements required some workarounds to account for its quirks and I can't guarantee everything is accounted for. 
1. Go to your stream overlay in StreamElements and edit your overlay.
2. Add a new custom widget
3. Make sure the widget is selected and go to the position size and style tab. Set the width and height to 600 each.
4. Click on settings and click open editor. It will show a window with html, css, js, fields, and data tab.
5. Go back to this repository. Click on the html file with the _se at the end of the file name.
6. Copy paste this into the html tab. This means, delete everything in the tab and relpace it with the code from this repository.
7. Do the same for the css file with the _se ending. Copy paste it into the css tab removing everything that was there before
8. Do the same for the js file with the _se ending. Copy paste it into the css tab removing everything that was there before.
9. Now to be safe, also delete everything in the fields and data tab.
10. After this, the chat widget should be good to go. You should be able to live test it by typing in your chat. 
