// popup.js
var notes = [];

var getNotesFromMem = async () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get("browserNOTES", (obj) => {
            return resolve(obj.browserNOTES);
        });
    });
}

var loadNotes = () => {
    if(notes.length == 0) {    // savedNotes == undefined || 
        $('#savedNotes').hide();
        $('#noNotesMessage').show();
        return;
    }

    $('#noNotesMessage').hide();
    $('#savedNotes').show();
    $('#savedNotes').empty();
    var div_notes = document.createElement('div');
    notes.forEach((note) => {
        var div_note = document.createElement('div');
        div_note.setAttribute('style', 'border:1px solid black; padding: 5px; margin: 5px 2px; overflow-wrap: break-word');
        div_note.setAttribute('id', note.id);

        var div_noteMessage = document.createElement('div');
        div_noteMessage.setAttribute('style', 'font-weight: bold');
        div_noteMessage.innerText = note.message;
        div_note.append(div_noteMessage);

        var small_date = document.createElement('small');
        small_date.innerHTML = '<i>' + note.createdTime + '</i>';
        div_note.append(small_date);
        div_note.append(' ');

        var btn_delete = document.createElement('button');
        btn_delete.setAttribute('id', note.id);
        btn_delete.setAttribute('class', 'delete');
        btn_delete.innerText = 'Delete';
        // btn_delete.setAttribute('onclick', 'delete()');
        div_note.append(btn_delete);

        div_notes.append(div_note);
    });
    $('#savedNotes').append(div_notes);
}

var saveNote = () => {
    var noteMessage = $('#noteMessage').val();
    var currNote = {};
    currNote.id = genId();
    currNote.message = noteMessage;
    currNote.createdTime = getCurrentTime();
    notes.splice(0, 0, currNote);
    loadNotes();
    chrome.storage.sync.set({browserNOTES: notes});
    $('#noteMessage').val('');
}

var deleteNote = () => {
    console.log(Event.target);
    var noteId = Event.target.id;
    notes = notes.forEach(note => {
        if(note.id != noteId) {
            return note;
        }
    });
    loadNotes();
    console.log('After deleting a note');
    console.table(notes);
    chrome.storage.sync.set({browserNOTES: notes});
}

var deleteAll = () => {
    if(window.confirm("All the notes will be deleted completely.")) {
        notes = [];
        chrome.storage.sync.set({browserNOTES: []}, () => {
            loadNotes();
            // window.alert("All the notes are deleted!");
        });
    }
}

var genId = () => {
    var id = '';
    for(var i = 0; i < 5; i++) {
        id += getRandAlphabet() + getRandNum();
    }
    return id;
}

var getRandAlphabet = () => {
    return String.fromCharCode(97 + Math.random() * 25);
}
var getRandNum = () => {
    return Math.floor(Math.random() * 9);
}

var getCurrentTime = () => {
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30
    var ISTTime = new Date(currentTime.getTime() + (currentOffset + ISTOffset) * 60000);
    return ISTTime.toLocaleString(); 
}

$(document).ready(async () => {
    notes = await getNotesFromMem();
    loadNotes();
    $('#saveNote').click(saveNote);
    $('#deleteAll').click(deleteAll);
    $('.delete').click(deleteNote());
    getCurrentTime();
});
