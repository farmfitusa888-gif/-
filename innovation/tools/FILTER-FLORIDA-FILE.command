#!/bin/bash
#
# FILTER-FLORIDA-FILE.command
#
# Double-click this. It finds the big Florida licence file wherever you left it,
# pulls out only the public adjusters, and puts a small file on your Desktop
# that you can drag into the chat.
#
# You do not need to know anything about Terminal. Double-clicking is enough.
#
# It never deletes or changes your original file. It only reads it.

cd "$(dirname "$0")" 2>/dev/null

BOLD=$'\033[1m'; GREEN=$'\033[32m'; RED=$'\033[31m'; YELL=$'\033[33m'; OFF=$'\033[0m'

echo ""
echo "${BOLD}Florida public adjuster filter${OFF}"
echo "-------------------------------------------------------------"
echo ""

# Write to the Desktop, but never fail if it is missing or unwritable.
DESKTOP="$HOME/Desktop"
if [ ! -d "$DESKTOP" ]; then mkdir -p "$DESKTOP" 2>/dev/null; fi
if [ -d "$DESKTOP" ] && [ -w "$DESKTOP" ]; then
  OUT="$DESKTOP/fl_public_adjusters.csv"
  WHERE="your Desktop"
else
  OUT="$HOME/fl_public_adjusters.csv"
  WHERE="your home folder"
fi

# --- 1. Find the file, wherever it is -----------------------------------------
echo "Looking for the Florida licence file..."

SEARCH_DIRS=("$HOME/Downloads" "$HOME/Desktop" "$HOME/Documents" "$HOME")
CSV=""
ZIP=""

for d in "${SEARCH_DIRS[@]}"; do
  [ -d "$d" ] || continue
  found=$(find "$d" -maxdepth 2 -iname "AllValidLicensesIndividual*.csv" -not -path "*/.*" 2>/dev/null | head -1)
  if [ -n "$found" ]; then CSV="$found"; break; fi
done

if [ -z "$CSV" ]; then
  for d in "${SEARCH_DIRS[@]}"; do
    [ -d "$d" ] || continue
    found=$(find "$d" -maxdepth 2 -iname "AllValidLicensesIndividual*.zip" -not -path "*/.*" 2>/dev/null | head -1)
    if [ -n "$found" ]; then ZIP="$found"; break; fi
  done
fi

# --- 2. Unzip if we only found the zip ----------------------------------------
if [ -z "$CSV" ] && [ -n "$ZIP" ]; then
  echo "  Found the zip: $ZIP"
  echo "  Unzipping (this can take a minute on a big file)..."
  WORKDIR="$(dirname "$ZIP")"
  unzip -o -q "$ZIP" -d "$WORKDIR" -x "__MACOSX/*" 2>/dev/null
  CSV=$(find "$WORKDIR" -maxdepth 2 -iname "AllValidLicensesIndividual*.csv" -not -path "*/.*" 2>/dev/null | head -1)
fi

if [ -z "$CSV" ]; then
  echo ""
  echo "${RED}Could not find the file.${OFF}"
  echo ""
  echo "I looked in Downloads, Desktop, Documents and your home folder for"
  echo "anything called AllValidLicensesIndividual (.csv or .zip)."
  echo ""
  echo "What to do: put the file in your Downloads folder, then double-click"
  echo "this again. If it has a different name, tell Claude the exact name."
  echo ""
  echo "Press Return to close."
  read -r
  exit 1
fi

SIZE=$(du -h "$CSV" | cut -f1)
echo "${GREEN}  Found it:${OFF} $CSV  ($SIZE)"
echo ""

# --- 3. Work out which column holds the licence type --------------------------
echo "Reading the column headings..."
HEADER=$(head -1 "$CSV")
echo ""
echo "${YELL}Column headings in your file:${OFF}"
echo "$HEADER" | tr ',' '\n' | nl | sed 's/^/    /'
echo ""

# --- 4. Filter -----------------------------------------------------------------
echo "Pulling out the public adjusters..."
if ! head -1 "$CSV" > "$OUT" 2>/dev/null; then
  echo "${RED}Could not write to $OUT${OFF}"
  echo "Press Return to close."; read -r; exit 1
fi
grep -i "public adjuster" "$CSV" >> "$OUT" 2>/dev/null

LINES=$(( $(wc -l < "$OUT" 2>/dev/null || echo 1) - 1 ))
[ "$LINES" -lt 0 ] && LINES=0

# --- 5. Report, and diagnose if the count looks wrong -------------------------
echo ""
if [ "$LINES" -gt 20 ] && [ "$LINES" -lt 200000 ]; then
  OUTSIZE=$(du -h "$OUT" | cut -f1)
  echo "${GREEN}${BOLD}Done.${OFF}"
  echo ""
  echo "  ${BOLD}$LINES public adjuster records${OFF}"
  echo "  Saved to $WHERE as: ${BOLD}fl_public_adjusters.csv${OFF}  ($OUTSIZE)"
  echo ""
  echo "  ${BOLD}Next: drag that file from $WHERE into the chat.${OFF}"
else
  echo "${YELL}That number looks wrong ($LINES rows), so here is what I found instead.${OFF}"
  echo ""
  echo "The 40 most common values in each of the first eight columns."
  echo "${BOLD}Copy everything below and paste it to Claude${OFF}, and you will get"
  echo "an exact filter back."
  echo ""
  for col in 1 2 3 4 5 6 7 8; do
    NAME=$(echo "$HEADER" | cut -d',' -f$col)
    echo "--- column $col : $NAME ---"
    tail -n +2 "$CSV" | cut -d',' -f$col | sort | uniq -c | sort -rn | head -12 | sed 's/^/    /'
    echo ""
  done
fi

echo "-------------------------------------------------------------"
echo "Your original file was not changed. Press Return to close."
read -r
