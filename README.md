Right-Click Selection Preserver
===============================

This is a quick hack to work around Chrome's current bug in the
Selection API where if you hold-down left click to select, and
try to right-click to copy, without letting go of the left mouse
button, you will lose your selection.

Note that this bug only occurs when the block of text is large
enough to overflow and generate a scrollbar. It actually
*has to* display a scrollbar.

"Premature Optimization is the Root of all Evil"
------------------------------------------------

So, I obviously tried to write this JavaScript in a way that
will not impact frequent events firing, so I'm sorry if the
absurdly C-like code looks awful.
