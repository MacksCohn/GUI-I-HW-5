// Max Cohn
// max_cohn@student.uml.edu
// GUI-I UML
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

// creates the tile slot in the main line
function GenerateTileSlots() {
    const $mainLine = $('#main-line');
    for (let tileColumn = 0; tileColumn < NUM_COLUMNS; tileColumn++) {
        const $newTile = $('<div class="tile-slot" id="slot' + tileColumn + '"' + '"></div>');
        $newTile.css({'left' : TILE_PADDING + tileColumn * (TILE_WIDTH + TILE_PADDING * 2)});
        $newTile.addClass('droppable');
        $newTile.data('multiplier', 1);
        $newTile.data('fullWord', false);
        $mainLine.before($newTile);
    }
}

// Create the tile slots in the tile holder
function GenerateHolderSlots(parent, numColumns) {
    const $parent = $(parent);
    for (let tileColumn = 0; tileColumn < numColumns; tileColumn++) {
        const $newTile = $('<div class="tile-slot in-holder" id="holder' + tileColumn + '"></div>');
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

// Generates the tiles for the first hand
function GenerateHand() {
    let hand = newHand(7);
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
        $tile.attr('name', tile);
        $holder.after($tile);
        ResizeTile($tile);
        index++;
    });
}

// Create the new tiles between hands
// Creates the correct amount to get the player back to seven tiles
function GenerateNewTiles() {
    let numToPull = 7 - $('.tile').length;
    let hand = newHand(numToPull);
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
        $tile.addClass('homeless');
        $tile.attr('id', 'tile' + (index + letterBag.length));
        $tile.attr('name', tile);
        $holder.after($tile);
        ResizeTile($tile);
        index++;
    });
    InitializeDragAndDroppables();
}

// Initializes the draggables and droppables, use after adding any new ones too
function InitializeDragAndDroppables() {
    $('.draggable').draggable({
        snapTolerance: 100,
        revert: 'invalid',
        revertDuration: 200,
    });
    $('.droppable').droppable({
        accept: function ($draggable) {
            let havePlacedTileOnBoard = false;
            $('.droppable:not(.in-holder)').each(function () {
                if ($(this).data('child') != undefined || $(this).data('child') != null) {
                    havePlacedTileOnBoard = true;
                    return false;
                }
            });
            if (havePlacedTileOnBoard) {
                const column = parseInt($(this).attr('id').substring($(this).attr('id').search(/\d/)));
                let farLeft = false;
                let farRight = false;
                if (column == 0)
                    farLeft = true;
                if (column == NUM_COLUMNS - 1)
                    farRight = true;
                const leftNeighborChild = $('#slot' + (column-1)).data('child');
                const rightNeighborChild = $('#slot' + (column+1)).data('child');
                if (!farLeft && leftNeighborChild != undefined && leftNeighborChild != null)
                    return true;
                else if (!farRight && rightNeighborChild != undefined && rightNeighborChild != null)
                    return true;
            }
            else {
                if ($draggable.hasClass('draggable')) {
                    return true;
                }
            }
        },
        drop: function(_, $held) {
            $held.draggable.position({
                my: 'center',
                at: 'center',
                of: $(this),
                using: function(pos) {
                    $(this).animate(pos, 50, 'swing');
                }
            });
            if ($(this).attr('id') === $held.draggable.data('parent'))
                return;

            const currentTile = $(this).data('child');
            if (currentTile != null && currentTile != undefined) {
                SwapTiles(currentTile, $held.draggable.attr('id'));
            }
            else if ($held.draggable.data('parent') != undefined) { // set parent and child exclusively to a pair
                // should it update the score
                data = GetRowAndColumn($('#' + $held.draggable.data('parent')));

                $('#' + $held.draggable.data('parent')).data('child', null);
                $held.draggable.data('parent', $(this).attr('id'));
                $(this).data('child', $held.draggable.attr('id'));

                // do that updating
                if (data.row != null && data.column != null)
                    UpdateWordScore(data.row, data.column);
            }
            else {
                $held.draggable.data('parent', $(this).attr('id'));
                $(this).data('child', $held.draggable.attr('id'));
            }

            data = GetRowAndColumn($(this));
            if (data.row != null && data.column != null)
                UpdateWordScore(data.row, data.column);
            // disables on place to match rubric
            if (!$(this).hasClass('in-holder'))
                $held.draggable.draggable('disable');
        },
    });
}

// scale the tiles on page resize
function ResizeTile($tile) {
    const $tileSlot = $('.tile-slot').first();
    $tile.width($tileSlot.width());
    $tile.height($tileSlot.height());
}

// put the tiles into the holder tile slots
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

// picks {amount} tiles and returns them in an array
function newHand(amount) {
    let hand = [];
    let numToPull = letterBag.length >= amount ? amount : letterBag.length;
    for (let i = 0; i < numToPull; i++)
        hand.push(PickLetter());
    return hand;
}

// Picks a random letter from the bag
function PickLetter() {
    const indexOfLetter = Math.floor(Math.random() * letterBag.length);
    const letter = letterBag[indexOfLetter];
    letterBag.splice(indexOfLetter, 1);

    return letter;
}

// Get the current row and column of a droppable
function GetRowAndColumn($droppable) {
    data = {
        row : null,
        column : null
    }
    let parentClasses = $droppable.parent().attr('class');
    if (parentClasses.includes('row')) {
        data.row = parentClasses.substring(parentClasses.indexOf('row'));
        if (data.row.indexOf(' ') != -1)
            data.row = data.row.substring(0, data.row.indexOf(' '));
        data.column = $droppable.attr('id');
    }
    return data;
}

// function I made to make tiles swappable, not used because it was against the rubric
function SwapTiles(currentTile, heldTile) {
    const $currentTile = $('#' + currentTile);
    const $heldTile = $('#' + heldTile);
    // set parents to empty
    const $currentParent = $('#' + $currentTile.data('parent'));
    const $heldParent = $('#' + $heldTile.data('parent'));
    $currentParent.data('child', null);
    $heldParent.data('child', null);
    // do the swap
    $currentParent.droppable('option', 'drop').call($currentParent, {}, {draggable : $heldTile});
    $heldParent.droppable('option', 'drop').call($heldParent, {}, {draggable : $currentTile});
    // correct the children 
    $heldParent.data('child', $currentTile.attr('id'));
    $currentParent.data('child', $heldTile.attr('id'));
}

function UpdateWordScore(row, column) {
    const $score = $('#word-value');
    const $word = $('#current-word');
    const $row = $('.' + row);
    let score = 0;
    let word = '';
    let wordMultiplier = 1;
    $row.children('.tile-slot').each(function() {
        if ($(this).data('child') != null && $(this).data('child') != undefined) {
            score += ScoreTile($(this));
            if ($(this).data('fullWord'))
                wordMultiplier *= $(this).data('multiplier');
            word += $('#' + $(this).data('child')).attr('name');
        }
        else if (word != '')
            return false;
    });
    $score.text(score * wordMultiplier);
    $word.text(word);
}

// Get the value of an individual tiles
function ScoreTile($tile) {
    let multiplier = $tile.data('fullWord') ? 1 : $tile.data('multiplier');
    if ($tile.data('child') != null && $tile.data('child') != undefined)
        return scores[$('#' + $tile.data('child')).attr('name')] * multiplier;
    return 0;
}

// Submits a word and adds to the total score, gets new letters
function SubmitCurrentWord() {
    const currentTotal = parseInt($('#total-score').text());
    const currentScore = parseInt($('#word-value').text());
    $('#total-score').text(currentTotal + currentScore);
    const $row = $('.row-0');
    let destroy = true;
    let word = '';
    const $holder = $('.holder-container');
    $row.children('.tile-slot').each(function () {
        if ($(this).data('child') != null && $(this).data('child') != undefined) {
            word += $('#' + $(this).data('child')).attr('name');
            if (destroy) {
                $('#' + $(this).data('child')).remove();
                $(this).data('child', null);
            }
            else {
                const $child = $('#' + $(this).data('child'));
                $(this).droppable('option', 'drop').call(FirstAvailableHolderSlot($holder), {}, { draggable : $child });
            }
        }
        else if (word != '')
            destroy = false;
    });
    GenerateNewTiles();
    $row.children('.tile-slot').each(function () {
        if ($(this).data('child') === null) {
            const homeless = $('.homeless');
            if (homeless.length <= 0)
                return false;
            const $child = $($('.homeless')[0]);
            $child.removeClass('homeless');
            $(this).droppable('option', 'drop').call(FirstAvailableHolderSlot($holder), {}, { draggable : $child });
        }
    });
    DoResize();
    $('#word-value').text(0);
    $('#current-word').text('');
    $('#letters-remaining').text(letterBag.length);
}

// Get the first slot to put extra letters back in. Also does not really
// do anything in the rubric branch
function FirstAvailableHolderSlot($holder) {
    let $slot = null;
    $holder.children('.tile-slot').each(function() {
        if ($(this).data('child') === null || $(this).data('child') == undefined) {
            $slot = $(this);
            return false;
        }
    });
    return $slot;
}

// resizes the game board and tile-slots
function DoResize() {
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

    $('.ui-droppable').each(function() {
        const child = $(this).data('child');
        if (child != null && child != undefined) {
            $(this).droppable('option','drop').call($(this), {}, { draggable: $('#' + child) });
        }
    });
}

// Restarts the game by reloading the page.
function RestartGame() {
    document.location.reload();
}

$(document).ready(function () { 
    GenerateTileSlots();
    GenerateHand();
    GenerateHolderSlots('.holder-container', 7);

    InitializeDragAndDroppables();

    PutTilesInHolder();
    
    $('#play-word').on('click', function() { SubmitCurrentWord() });
    $('#restart-game').on('click', function () { RestartGame() });

    // set bonus square values
    $('.row-0 #slot2').data('multiplier', 2);
    $('.row-0 #slot2').data('fullWord', true);
    $('.row-0 #slot6').data('multiplier', 2);
    $('.row-0 #slot6').data('fullWord', false);
    $('.row-0 #slot8').data('multiplier', 2);
    $('.row-0 #slot8').data('fullWord', false);
    $('.row-0 #slot12').data('multiplier', 2);
    $('.row-0 #slot12').data('fullWord', true);

    DoResize();
});

// function to keep the lines the correct position on resize of the window
let resizeTimer;
$(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(DoResize, 100);
});

