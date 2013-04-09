
var blnTest = false;

var InviewApp = {};
InviewApp.Config = {};
InviewApp.Config.Dialogs = {}
InviewApp.Config.Dialogs.DeleteContact = '<li action="delete">Delete Contact</li><li action="cancel">Cancel</li>';
InviewApp.Config.Dialogs.EditContacts = '<li action="add">Add Contact</li><li action="info">Contacts Info</li><li action="edit">Delete Contacts</li><li action="cancel">Cancel</li>';
InviewApp.Config.Dialogs.EditGroupContacts = '<li action="addgroup">Add Group</li><li action="add">Add Contact</li><li action="info">Contacts Info</li><li action="edit">Delete Contacts</li><li action="cancel">Cancel</li>';
InviewApp.Config.Dialogs.Edit = '<li action="edit"><form><textarea cols="25" rows="13" placeholder="let me grow and close the popup" id="editDialog1" name="editDialog"></textarea></form></li>';

InviewApp.Config.InitContactData = { "chid": "", "title": "", "location": "", "avatar": "imgs/space.gif", "profile": {
    "firstname": "",
    "midname": "",
    "lastname": "",
    "country": "",
    "state": "",
    "city": "",
    "phones": {
        "home": "",
        "office": "",
        "mobile": ""
    },
    "email": "",
    "location": "",
    "gender": ""
},
    "presence": "empty"
};
InviewApp.Config.TestChatList = {}
InviewApp.Config.TestChatList['john.doe@citi.com'] =
{
    "chid": "001",
    "cnport": "cn001",
    "cmport": "cm001",
    "title": "John Doe",
    "profile": {
        "firstname": "John",
        "midname": "",
        "lastname": "Doe",
        "country": "USA",
        "state": "CA",
        "city": "Santa Rosa",
        "phones": {
            "home": "(707) 123-4567",
            "office": "(718) 123-4567",
            "mobile": ""
        },
        "email": "john.doe@citi.com",
        "location": "1 Court Pl, NY",
        "gender": "male"
    },
    "avatar": "imgs/chat/GregoryPeck.jpg",
    "presence": "online"
};
InviewApp.Config.TestChatList['jane.doe@citi.com'] =
{
    "chid": "002",
    "cnport": "cn002",
    "cmport": "cm002",
    "title": "Jane Doe",
    "location": "1 Court Pl, NY",
    "avatar": "imgs/chat/MarilynMonroe.jpg",
    "profile": {
        "firstname": "Jane",
        "midname": "",
        "lastname": "Doe",
        "country": "USA",
        "state": "CA",
        "city": "Santa Rosa",
        "phones": {
            "home": "(707) 123-4567",
            "office": "(718) 123-4567",
            "mobile": ""
        },
        "email": "jane.doe@citi.com",
        "location": "1 Court Pl, NY",
        "gender": "female"
    },
    "presence": "online"
};
InviewApp.Config.TestChatList['jack.doe@citi.com'] =
{
    "chid": "003",
    "cnport": "cn003",
    "cmport": "cm003",
    "title": "Jack Doe",
    "location": "1 Court Pl, NY",
    "avatar": "imgs/chat/PaulNewman.jpg",
    "profile": {
        "firstname": "Jack",
        "midname": "",
        "lastname": "Doe",
        "country": "USA",
        "state": "CA",
        "city": "Santa Rosa",
        "phones": {
            "home": "(707) 123-4567",
            "office": "(718) 123-4567",
            "mobile": ""
        },
        "email": "jack.doe@citi.com",
        "location": "1 Court Pl, NY",
        "gender": "male"
    },
    "presence": "online"
};
InviewApp.Config.User = {};

InviewApp.Config.ChatSettingsTitles = [
    {title: 'Status', icon: ''},
    {title: 'My Profile', icon: ''},
    {title: 'Settings', icon: ''},
    {title: 'Add Contact', icon: ''},
    {title: 'Add Chat Group', icon: ''}
];
InviewApp.Utils = {};
InviewApp.Utils.setContactModel = function () {
    var md = Backbone.Model.extend();
    var model = new md;
    model.set(arguments[0])
    return model;
};
InviewApp.Utils.stopPropagation = function (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
};
