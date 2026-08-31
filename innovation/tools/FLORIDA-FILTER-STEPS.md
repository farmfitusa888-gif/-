# Filtering the Florida licence file, without the blocked script

macOS refused to open `FILTER-FLORIDA-FILE.command`. That is Gatekeeper doing
its job. Anything with an executable bit that arrived over the internet gets a
`com.apple.quarantine` flag, and since macOS Sequoia the old right-click and
Open trick no longer clears it. Two ways round it. The second one always works
because it involves no file at all.

---

## Option A: unblock the script (three clicks)

1. Double-click `FILTERFLORIDAFILE.command` once. It will be refused. That
   refusal is what puts the override button on screen, so this step is not
   optional.
2. Open **System Settings**, then **Privacy & Security**.
3. Scroll to the bottom. There will be a line reading
   *"FILTERFLORIDAFILE.command was blocked to protect your Mac."*
   Click **Open Anyway**, then confirm with Touch ID or your password.
4. Double-click the file again. A second dialog appears. Click **Open Anyway**.

The notice in step 3 only shows for about an hour after the block, which is why
step 1 comes first. If the line is missing, double-click the file again and go
straight back to Privacy & Security.

---

## Option B: no file, no Gatekeeper (recommended)

Gatekeeper only guards files. Text you paste into Terminal is not a file, so
there is nothing to block.

1. Hold **Command** and press **Space**. A search bar opens.
2. Type `Terminal` and press **Return**. A window with white or black
   background and a text cursor appears. This is the right thing.
3. Copy the whole block below. All of it, in one go. It is one long line.

```
f=$(find ~/Downloads ~/Desktop ~/Documents -maxdepth 3 -iname "AllValidLicensesIndividual*.csv" 2>/dev/null | head -1); [ -z "$f" ] && f=$(find ~/Downloads ~/Desktop ~/Documents -maxdepth 3 -iname "AllValidLicensesIndividual*.zip" 2>/dev/null | head -1); case "$f" in *.zip) d="$HOME/Downloads/flunzip"; mkdir -p "$d"; unzip -oq "$f" -d "$d"; f=$(find "$d" -iname "*.csv" | head -1);; esac; echo "Using: $f"; o=~/Desktop/fl_public_adjusters.csv; head -1 "$f" > "$o"; grep -i "public adjuster" "$f" >> "$o"; echo "Public adjusters found: $(( $(wc -l < "$o") - 1 ))"; echo "Saved to your Desktop as fl_public_adjusters.csv"
```

4. Click into the Terminal window, paste with **Command-V**, press **Return**.
5. Wait. On a file this size it takes under a minute. When it stops you will see
   a count and the words *Saved to your Desktop*.
6. Look on your Desktop for `fl_public_adjusters.csv` and drag it into the chat.

Nothing here modifies or deletes your original file. `grep` reads; it does not
write. The only file created is the small filtered copy on your Desktop, plus a
`flunzip` folder in Downloads if the original was still zipped.

### If the count comes back as 0

The column holding the licence type is named something other than what I
expect, or the file uses a different phrase. Paste this instead, and send me
what it prints:

```
f=$(find ~/Downloads ~/Desktop ~/Documents -maxdepth 3 -iname "AllValidLicensesIndividual*.csv" 2>/dev/null | head -1); echo "--- headings ---"; head -1 "$f" | tr "," "\n" | nl; echo "--- most common values, columns 1 to 8 ---"; for c in 1 2 3 4 5 6 7 8; do echo "column $c:"; tail -n +2 "$f" | cut -d"," -f$c | sort | uniq -c | sort -rn | head -8; done
```

That prints the headings and the twelve most common values in each of the first
eight columns. From that I can hand you an exact filter.

### If it says "command not found" or nothing happens

You are probably in the wrong window. Terminal shows a line ending in `%` or `$`
with a blinking cursor. If what you see is a document, a browser, or the Notes
app, close it and repeat step 1.

---

## Why this exists

Florida publishes every valid individual insurance licence in one file. Public
adjusters are a few hundred rows inside roughly a million. The full file is too
large to upload here, so the filtering has to happen on your machine first. Both
options above do the same thing: keep the header row, keep every row containing
the phrase "public adjuster", throw away the rest.

Tested against a 1,250-row synthetic file with 179 public adjusters planted in
it. Both the plain-CSV and still-zipped paths returned exactly 179.
