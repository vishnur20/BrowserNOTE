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
    if(notes.length == 0) {
        $('#savedNotes').hide();
        $('#noNotesMessage').show();
        return;
    }

    $('#noNotesMessage').hide();
    $('#savedNotes').show();
    $('#savedNotes').empty();
    var div_notes = $('#savedNotes');
    notes.forEach((note) => {
        var div_note = document.createElement('div');
        // div_note.setAttribute('style', 'border:2px solid black; padding: 5px; margin: 5px 2px; overflow-wrap: break-word');
        div_note.setAttribute('id', note.id);
        div_note.setAttribute('class', 'note');

        var div_noteMessage = document.createElement('div');
        div_noteMessage.setAttribute('class', 'note_message');
        div_noteMessage.innerText = note.message;
        div_note.append(div_noteMessage);

        var small_date = document.createElement('small');
        small_date.innerHTML = '<em>' + note.createdTime + '</em>';
        div_note.append(small_date);

        var btn_delete = document.createElement('button');
        btn_delete.setAttribute('class', 'delete_btn');
        btn_delete.innerText = 'Delete';
        btn_delete.click(() => {
            deleteNote();
        });
        div_note.append(btn_delete);
        div_notes.append(div_note);
    });
}

var saveNote = () => {
    var noteMessage = $('#noteMessage').val();
    if(noteMessage == "") {
        window.alert('Type something.');
        return;
    }

    var currNote = {};
    currNote.id = genId();
    currNote.message = noteMessage;
    currNote.createdTime = getCurrentTime();
    // notes.push(currNote);    // for inserting at last
    
    var div_currNote = document.createElement('div');
    div_currNote.setAttribute('id', currNote.id);
    div_currNote.setAttribute('class', 'note');
    var div_noteMessage = document.createElement('div');
    div_noteMessage.setAttribute('class', 'note_message');
    var small_date = document.createElement('small');
    var btn_delete = document.createElement('button');
    btn_delete.setAttribute('class', 'delete_btn');
    btn_delete.innerText = 'Delete';
    btn_delete.click(() => {
        deleteNote();
    });
    small_date.innerHTML = "<em>" + currNote.createdTime + "</em>";
    div_noteMessage.innerText = currNote.message;
    div_currNote.append(div_noteMessage);
    div_currNote.append(small_date);
    div_currNote.append(btn_delete);
    $('#savedNotes').prepend(div_currNote);
    $('#noteMessage').val('');
    
    notes.splice(0, 0, currNote);    // for inserting at indx 0
    if(notes.length > 0) {
        $('#noNotesMessage').hide();
        $('#savedNotes').show();

    }
    chrome.storage.sync.set({browserNOTES: notes});
}

var deleteNote = (e) => {
    if(e.target.getAttribute('class') != 'delete_btn') {
        return;
    }
    var noteId = e.target.parentNode.getAttribute('id');
    $("#" + noteId).remove();
    var updatedNotes = notes.filter(note => {
        return note.id != noteId;
    });
    notes = updatedNotes;
    if(notes.length == 0) {
        $('#savedNotes').hide();
        $('#noNotesMessage').show();
    }
    chrome.storage.sync.set({browserNOTES: notes});
}

var deleteAll = () => {
    if(window.confirm("All the notes will be deleted completely.")) {
        $('#savedNotes').html('');
        $('#savedNotes').hide();
        $('#noNotesMessage').show();
        notes = [];
        chrome.storage.sync.set({browserNOTES: []});
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
    $('#savedNotes').click(deleteNote);
    // $('.delete').click(deleteNote);
});
