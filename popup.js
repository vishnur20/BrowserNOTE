// popup.js
var notes = [];

var getNotesFromMem = async () => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get("browserNOTES", (obj) => {
                resolve(obj.browserNOTES);
            });
        } catch(err) {
            reject(err);
        }
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
        div_notes.append(getNoteDiv(note));
    });
}

var getNoteDiv = (note) => {
    var div_note = document.createElement('div');
    // div_note.setAttribute('style', 'border:2px solid black; padding: 5px; margin: 5px 2px; overflow-wrap: break-word');
    div_note.setAttribute('id', note.id);
    div_note.setAttribute('class', 'note');

    var div_noteMessage = document.createElement('div');
    div_noteMessage.setAttribute('class', 'note-message');
    div_noteMessage.innerText = note.message;
    div_note.append(div_noteMessage);

    var small_date = document.createElement('small');
    small_date.innerHTML = '<em>' + note.createdTime + '</em>';
    div_note.append(small_date);

    var a_delete = document.createElement('a');
    a_delete.setAttribute('class', 'delete-btn');
    a_delete.innerText = 'Delete';
    a_delete.click(() => {
        deleteNote();
    });
    small_date.append(a_delete);
    return div_note;
}

var saveNote = (e) => {
    e.stopPropagation();
    var noteMessage = $('#noteMessage').val();
    if(noteMessage == "") {
        window.alert('Type something.');
        return;
    }

    var currNote = {};
    currNote.id = genId();
    currNote.message = noteMessage;
    currNote.createdTime = getCurrentTime();
    
    $('#savedNotes').prepend(getNoteDiv(currNote));
    $('#noteMessage').val('');
    
    notes.splice(0, 0, currNote);    // for inserting at indx 0
    if(notes.length > 0) {
        $('#noNotesMessage').hide();
        $('#savedNotes').show();

    }
    chrome.storage.sync.set({browserNOTES: notes});
}

var deleteNote = (e) => {
    if(e.target.getAttribute('class') != 'delete-btn') {
        return;
    }
    var noteId = e.target.parentNode.parentNode.getAttribute('id');
    //
    console.log(e.target.parentNode);
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
    //
    console.log(notes);
    loadNotes();
    $('#saveNote').click(saveNote);
    $('#deleteAll').click(deleteAll);
    $('#savedNotes').click(deleteNote);
    // $('.delete').click(deleteNote);
});
