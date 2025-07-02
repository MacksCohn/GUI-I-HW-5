// Max Cohn
const A_ASCII = 65;
const LAST_ASCII = A_ASCII + 26;
const NUM_COLUMNS = 15; 
var TILE_WIDTH = $('#main-line').width() / NUM_COLUMNS - $('#main-line').width() * (8/960);
var TILE_HEIGHT = $('#main-line').height() - $('#main-line').height() * (8/64);
var TILE_PADDING = $('#main-line').width() * (4/960);

const quantities = {
    'A' : 9, 'B' : 2,
    'C' : 2, 'D' : 4,
    'E' : 12, 'F' : 2,
    'G' : 3, 'H' : 2,
    'I' : 9, 'J' : 1,
    'K' : 1, 'L' : 4,
    'M' : 2, 'N' : 6,
    'O' : 8, 'P' : 2,
    'Q' : 1, 'R' : 6,
    'S' : 4, 'T' : 6,
    'U' : 4, 'V' : 2,
    'W' : 2, 'X' : 1,
    'Y' : 2, 'Z' : 1,
    ' ' : 2,
}
const scores = {
    'A' : 1, 'B' : 3,
    'C' : 3, 'D' : 2,
    'E' : 1, 'F' : 4,
    'G' : 2, 'H' : 4,
    'I' : 1, 'J' : 8,
    'K' : 5, 'L' : 1,
    'M' : 3, 'N' : 1,
    'O' : 1, 'P' : 3,
    'Q' :10, 'R' : 1,
    'S' : 1, 'T' : 1,
    'U' : 1, 'V' : 4,
    'W' : 4, 'X' : 8,
    'Y' : 4, 'Z' : 10,
    ' ' : 0,
}
let letterBag = [];
// Fill the letter bag
for (let currentLetter = A_ASCII; currentLetter < LAST_ASCII; currentLetter++) {
    const numOfThatLetter = quantities[String.fromCharCode(currentLetter)];
    for (let i = 0; i < numOfThatLetter; i++)
        letterBag.push(String.fromCharCode(currentLetter));
}
// add the blanks to the bag
for (let i = 0; i < quantities[' ']; i++) {
    letterBag.push(' ');
}

function pickLetter() {
    const indexOfLetter = Math.floor(Math.random() * letterBag.length);
    const letter = letterBag[indexOfLetter];
    letterBag.splice(indexOfLetter, 1);

    return letter;
}

function GenerateTileSlots() {
    const $mainLine = $('#main-line');
    for (let tileColumn = 0; tileColumn < NUM_COLUMNS; tileColumn++) {
        const $newTile = $('<div class="tile-slot" id="slot' + tileColumn + '"' + '"></div>');
        $newTile.css({'left' : TILE_PADDING + tileColumn * (TILE_WIDTH + TILE_PADDING * 2)});
        $newTile.addClass('droppable');
        $mainLine.before($newTile);
    }
}

function GenerateHolderSlots(parent, numColumns) {
    const $parent = $(parent);
    for (let tileColumn = 0; tileColumn < numColumns; tileColumn++) {
        const $newTile = $('<div class="tile-slot in-holder"></div>');
        $newTile.css({
            'left' : $parent.width() * .08 + tileColumn * (TILE_WIDTH + TILE_PADDING * 2), 
            'width' : TILE_WIDTH,
            'height': TILE_HEIGHT,
            'top': '30%',
        });
        $newTile.addClass('droppable');
        $parent.append($newTile);
    }
}
function PutTilesInHolder() {
    const holderSlots = $('.tile-slot.in-holder.droppable');
    const tiles = $('.tile.draggable');
    if (holderSlots.length >= tiles.length) {
        for (let i = 0; i < tiles.length; i++)
            $(holderSlots[i]).droppable('option', 'drop').call(
                $(holderSlots[i]), {}, { draggable: $(tiles[i]) }
            );
    }
}

function GenerateHand() {
    let hand = newHand();
    let index = 1;
    hand.forEach(tile => {
        const $holder = $('.holder-container');
        let $tile;
        if (tile === ' ')
            $tile = $('<img src="./img/Scrabble_Tile_Blank.jpg">');
        else
            $tile = $('<img src="./img/Scrabble_Tile_' + tile + '.jpg">');
        $tile.addClass('tile');
        $tile.addClass('draggable');
        $tile.attr('id', 'tile' + (index + letterBag.length));
        $holder.after($tile);
        ResizeTile($tile);
        index++;
    });
}

function newHand() {
    let hand = [];
    let numToPull = letterBag.length >= 7 ? 7 : letterBag.length;
    for (let i = 0; i < numToPull; i++)
        hand.push(pickLetter());
    return hand;
}

function ResizeTile($tile) {
    const $tileSlot = $('.tile-slot').first();
    $tile.width($tileSlot.width());
    $tile.height($tileSlot.height());
}

function InitializeDragAndDroppables() {
    $('.draggable').draggable({
        snapTolerance: 100,
        revert: 'invalid',
    });
    $('.droppable').droppable({
        accept: '.draggable',
        drop: function(_, $ui) {
            $ui.draggable.position({
                my: 'center',
                at: 'center',
                of: $(this),
                using: function(pos) {
                    $(this).animate(pos, 50, 'swing');
                }
            });
            // set parent and child exclusively to a pair
            if ($ui.draggable.data('parent') != undefined) {
                $('#' + $ui.draggable.data('parent')).data('child', null);
            }
            $ui.draggable.data('parent', $(this).attr('id'));
            $(this).data('child', $ui.draggable.attr('id'));
        },
    });
}

$(document).ready(function () { 
    GenerateTileSlots();
    GenerateHand();
    GenerateHolderSlots('.holder-container', 7);

    InitializeDragAndDroppables();

    PutTilesInHolder();
});

// function to keep the lines the correct position on resize of the window
$(window).resize(function () {
    TILE_WIDTH = $('#main-line').width() / NUM_COLUMNS - $('#main-line').width() * (8/960);
    TILE_HEIGHT = $('#main-line').height() - $('#main-line').height() * (8/64);
    TILE_PADDING = $('#main-line').width() * (4/960);
    let tileColumn = 0;

    $('.tile-slot:not(.in-holder)').each(function() {
        $(this).css({'left' : TILE_PADDING + tileColumn * (TILE_WIDTH + TILE_PADDING * 2)});
        tileColumn++;
    });
    tileColumn = 0;
    $('.tile-slot.in-holder').each(function() {
        $(this).css({
            'left' : $('.holder-container').width() * .08 + tileColumn * (TILE_WIDTH + TILE_PADDING * 2), 
            'top': '30%',
            'width' : TILE_WIDTH,
            'height': TILE_HEIGHT,
        });
        tileColumn++;
    });

    $('.tile').each(function() {
        ResizeTile($(this));
    });
});
