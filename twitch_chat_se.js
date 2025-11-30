// 1, 2, or 4. 4 grabs the highest quality
const EMOTE_SCALE = 4; 

// 14px, 28px, and 56px would natively match the emotes with the correct 1:2 ratio
// Badge and emotes will scale accordingly to this
// REMEMBER TO CHANGE THE FONT SIZE IN THE CSS TAB!!!
const FONT_SIZE = 28;

const GlobalTwitchBadgesMap = new Map();
const ChannelTwitchBadgesMap = new Map();
//let bIsContainerHighlighted = false;
const ImgLoadArray = [];
let UniqueImageID = 0;
const MessageDivsToAdd = [];


function TestMessageEvent()
{
    const message = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                data:
                {
                    "time": 1552400352142,
                    "tags": {
                        "badges": "broadcaster/1",
                        "color": "#641FEF",
                        "display-name": "SenderName",
                        "emotes": "25:5-9",
                        "flags": "",
                        "id": "885d1f33-8387-4206-a668-e9b1409a998b",
                        "mod": "0",
                        "room-id": "85827806",
                        "subscriber": "0",
                        "tmi-sent-ts": "1552400351927",
                        "turbo": "0",
                        "user-id": "85827806",
                        "user-type": ""
                    },
                    "nick": "sendername",
                    "userId": "123123",
                    "displayName": "senderName",
                    "displayColor": "#641FEF",
                    "badges": [
                        {
                            "type": "broadcaster",
                            "version": "1",
                            "url": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
                            "description": "Broadcaster"
                        }
                    ],
                    "channel": "channelname",
                    "text": "Test Kappa test",
                    "isAction": false,
                    "emotes": [
                        {
                            "type": "twitch",
                            "name": "Kappa",
                            "id": "25",
                            "gif": false,
                            "urls": {
                                "1": "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                "2": "https://static-cdn.jtvnw.net/emoticons/v1/25/2.0",
                                "4": "https://static-cdn.jtvnw.net/emoticons/v1/25/4.0"
                            },
                            "start": 5,
                            "end": 9
                        }
                    ],
                    "msgId": "885d1f33-8387-4206-a668-e9b1409a99Xb"

                }
            }
        }
    });
    window.dispatchEvent(message);
}

function UpdateChat() 
{
    const ChatElement = document.getElementById("chat-container");
    let ChatBounds = ChatElement.getBoundingClientRect();
    
    const ChildrenToDelete = [];
    for (const child of ChatElement.children)
    {
        const MsgBounds = child.getBoundingClientRect();

        if (ChatBounds.y > (MsgBounds.y))
        {
            //console.log("Element is clipping or offscreen");
            
            ChildrenToDelete.push(child);
            //ChatElement.removeChild(child);
        }

    }

    for (const child of ChildrenToDelete)
    {
        //console.log(child);
        //console.log("Printing bounds");
        //console.log(child.getBoundingClientRect());
        ChatElement.removeChild(child);
    }
}


function AddMessage(NumToAdd)
{
    //console.log(`AddMessage(${NumToAdd})`);
    if (NumToAdd > 0)
    {
        
        let fragment = document.createDocumentFragment();
        const container = document.getElementById("chat-container");
        while (NumToAdd > 0)
        {
            NumToAdd -= 1;
            if (MessageDivsToAdd.length > 0)
            {
                fragment.appendChild(MessageDivsToAdd[0]);
                MessageDivsToAdd.shift();
            }
            else
            {
                console.log("No messages to add despite array of images loaded");
            }
        }
        // Add to chat
        container.appendChild(fragment);
        // now remove any clipping elements and update chat.
        UpdateChat();
    }
}

function HandleImageLoad(ImageID)
{
    return function (event) {
        //console.log(`ImgLoadArray has ${ImgLoadArray.length}`);
        // Look through array, find matching id, remove it from its array
        for (let i = 0; i < ImgLoadArray.length; ++i)
        {
            for (let j = 0; j < ImgLoadArray[i].length; ++j)
            {
                if (ImgLoadArray[i][j] == ImageID)
                {
                    ImgLoadArray[i].splice(j, 1);
                    break;
                }
            }
        }
        // add messages that are completely loaded in order
        // stop on first one not fully loaded
        let NumToAdd = 0;
        while (ImgLoadArray.length > 0)
        {
            if (ImgLoadArray[0].length === 0)
            {
                ImgLoadArray.shift();
                NumToAdd += 1;
            }
            else
            {
                break;
            }
        }
        AddMessage(NumToAdd);
    };
}

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
    const data = obj.detail.event.data;
    if (listener === 'message') {
        if (data && data.text)
        {

            const message = {
                username: data.displayName,
                displayColor: data.displayColor || "#0000ff",
                badges: data.badges || [],
                text: data.text,
                badges: data.badges || [],
                emotes: data.emotes || []
            };
            
            const newDiv = document.createElement("div");
            newDiv.classList.add("chat-entry");
            // handle badges
            // necessary.
            const ImgSrcs = [];
            const ImgLoadArrayForOneMessage = [];
            // add badges
            for (const badge_single of message.badges)
            {
                const ABadge = document.createElement("img");
                ABadge.height = FONT_SIZE / 14 * 18;
                ABadge.width = FONT_SIZE / 14 * 18;
                ABadge.onload = HandleImageLoad(UniqueImageID);
                ImgLoadArrayForOneMessage.push(UniqueImageID);
                UniqueImageID += 1;
                ImgSrcs.push(badge_single.url);
                ABadge.classList.add("badge");
                newDiv.appendChild(ABadge);
            }    



            // username
            const AElement = document.createElement("a");
            AElement.classList.add("username");
            AElement.appendChild(document.createTextNode(message.username));
            AElement.style.color = message.displayColor;
            const SpanTwo = document.createElement("a");
            SpanTwo.appendChild(document.createTextNode(": "));
           
            newDiv.appendChild(AElement);
            newDiv.appendChild(SpanTwo);

            // message
            // handle emotes
            const EmoteArray = [];

            for (const emote_single of message.emotes)
            {
                // eg. "Kappa"
                EmoteArray.push(emote_single.name);
                ImgSrcs.push(emote_single.urls[`${EMOTE_SCALE}`]);
            }    

            let TempStr = "";

            const SplitMsg = message.text.split(" ");
            //console.log(EmoteArray);
            for (let i = 0; i < SplitMsg.length; ++i)
            {
                if (EmoteArray.length > 0 && SplitMsg[i] === EmoteArray[0])
                {
                    
                    // add TempStr before adding image
                    if (TempStr !== "")
                    {
                        const SpanTest = document.createElement("a");
                        SpanTest.appendChild(document.createTextNode(TempStr));
                        newDiv.appendChild(SpanTest);
                    }
                    //console.log(`Adding ${EmoteArray[0][1]}`);
                    
                    let img = document.createElement("img");
                    img.height = FONT_SIZE * 2;
                    img.width = FONT_SIZE * 2;
                    ImgLoadArrayForOneMessage.push(UniqueImageID);
                    img.onload = HandleImageLoad(UniqueImageID);

                    UniqueImageID += 1;
                                        
                    // unsure how to get the spacing right, so not doing this
                    //img.classList.add("emote");

                    newDiv.appendChild(img);
                    EmoteArray.shift();
                    TempStr = "";
                }
                else if (SplitMsg[i] === "")
                {
                    TempStr += " ";
                }
                else
                {
                    // add space after previous word
                    // we split by space, so this is just adding the space back.
                    if (i !== 0)
                    {
                        TempStr += " ";
                    }
                    TempStr += SplitMsg[i];
                }
            }
            if (TempStr !== "")
            {
                const SpanTest = document.createElement("a");
                SpanTest.appendChild(document.createTextNode(TempStr));
                newDiv.appendChild(SpanTest);
                TempStr =  "";
            }
            
            MessageDivsToAdd.push(newDiv);
            const ChatElement = document.getElementById("chat-container");
            ChatElement.appendChild(newDiv);
            ImgLoadArray.push(ImgLoadArrayForOneMessage);

            for (let i = 0; i < MessageDivsToAdd[MessageDivsToAdd.length - 1].children.length; ++i)
            {
                if (MessageDivsToAdd[MessageDivsToAdd.length - 1].children[i].tagName === "IMG")
                {
                    const ImgSrc = ImgSrcs.shift();
                    MessageDivsToAdd[MessageDivsToAdd.length - 1].children[i].setAttribute("src", ImgSrc);
                    // hopefully, they don't load before all are completely added so that a callback doesn't happen early
                }
            }
            
            return;
        }

    }
});


window.addEventListener('onWidgetLoad', function(obj) {
    TestMessageEvent();
    return;
});
