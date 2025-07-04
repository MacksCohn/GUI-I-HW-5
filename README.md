# GUI I HW 5 Writeup
Max Cohn

#### Github Stuff
Github repo: https://github.com/MacksCohn/GUI-I-HW-5
Github page: https://mackscohn.github.io/GUI-I-HW-5/

**NOTE: The more user friendly branch is the main branch on github, which is the one I have up on the github pages site.**
**The submitted files are different, from the github 'rubric' branch. They match the criteria better.**

## Working Features
Hand generation
Tiles can be dragged and dropped onto the board
Placed letters are identified and shown in the current word span
Functioning bonus squares, can technically be set to any multiplier
Current word and current word value displays live and updates when tiles are added
Scoring works as expected and includes multipliers
Can play until tiles run out
The board is cleared after submitting. In the main branch (not the 'rubric' branch), tiles that are places on the board that are not part of the counted word are returned to the holder
Only the tiles needed are picked to fill hand
Total score is kept between rounds
Tiles can be dragged anywhere to the scrabble board at first, and bounce if invalid
Tiles are immovable after they are placed (Different in the main branch, where I implemented tile swapping)
Once a tile is placed, tiles can only be placed in front of or behind the placed tile
Restart button restarts the game by reloading the page

## Partially Working Features
Tile swapping does not really work on the rubric branch or in the submitted version, see it functional in the main branch
Tile swapping works correctly only before any tiles are placed and only in the tile holder on the 'rubric' branch

## Not Working
None

## Additional Features I added
The game resizes when the window is resized
> The tiles will move back to their position on resize properly after the resizing is complete
Tile swapping is implemented on the main branch, which makes the game much more intuitive
