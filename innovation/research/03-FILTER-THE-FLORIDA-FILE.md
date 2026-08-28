# Filtering the Florida file — copy and paste, step by step

For macOS. Takes about two minutes. **Do not open this file in Excel or
Numbers** — it unzips to hundreds of megabytes and both will either choke or
silently truncate it, which is worse than choking.

---

## Step 1 — Open Terminal

Press **⌘ + Space**, type `Terminal`, press **Enter**.

A black or white window opens with a prompt. That is all you need.

## Step 2 — Go to your Downloads folder

Type this exactly and press Enter:

```
cd ~/Downloads
```

Nothing visible happens. That is correct — it just means "work in Downloads".

## Step 3 — Unzip the file

```
unzip AllValidLicensesIndividual.csv.zip
```

You will see a line scroll past ending in the name of the CSV it extracted.
**Note that name** — it may not be exactly `AllValidLicensesIndividual.csv`.

If the name is different, use whatever it actually says in the next steps.

## Step 4 — Look at the column headings

```
head -1 AllValidLicensesIndividual.csv
```

This prints one line: the header row. **Copy that whole line and paste it to me.**
It tells me which column holds the licence type, which is the only thing I need
to give you an exact filter.

## Step 5 — Make the filtered file

```
head -1 AllValidLicensesIndividual.csv > fl_public_adjusters.csv
grep -i "public adjuster" AllValidLicensesIndividual.csv >> fl_public_adjusters.csv
```

Line one keeps the header. Line two appends every row mentioning "public
adjuster". **The `>>` on the second line is two arrows** — one arrow would wipe
out the header you just saved.

## Step 6 — Check it worked

```
wc -l fl_public_adjusters.csv
```

This prints a number: how many lines the new file has.

- **A number in the hundreds or low thousands** — that is right. Florida is a
  big adjusting market, so a few thousand would not surprise me.
- **Just `1`** — only the header. The filter matched nothing, which means the
  file labels the licence type differently. Do step 7.
- **Something enormous, like 300,000** — the phrase is matching far more than
  intended. Also do step 7.

## Step 7 — Only if step 6 looked wrong

```
cut -d, -f5 AllValidLicensesIndividual.csv | sort | uniq -c | sort -rn | head -40
```

This prints the 40 most common values in column 5 with counts. **Paste that
output to me** and I will give you the exact filter for the real column. If
column 5 is obviously the wrong one, change the `-f5` to `-f6`, `-f7` and so on
until the values look like licence types.

## Step 8 — Send it to me

The new `fl_public_adjusters.csv` will be small. Drag it into the chat.

---

## If anything goes wrong

**"command not found"** — you mistyped. The commands are lowercase.

**"No such file or directory"** — the file is not in Downloads, or the name is
different. Run `ls *.zip` to see what zip files are actually there.

**You would rather not use Terminal at all** — then send me the header line from
step 4 by opening the CSV in a plain text editor (TextEdit, right-click → Open
With) and copying the first line only. I can work out the filter from that and
give you a single command to run.

---

## What I will do with it

Same as the Texas file: count active licences, split resident versus
out-of-state, rank by city, and chart the licence-issue trend. That completes
the picture across your three named states and tells us — accounting for the
overlap, since 293 of Texas's licensees are Florida residents — how large the
real, de-duplicated addressable pool is for Counterweight.
