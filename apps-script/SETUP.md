# Connect IronRidge University to a Google Sheet

The training site can keep each rep's progress in a Google Sheet you own, and email you when someone races through a course. Until you finish these steps and paste the web app URL into the site, nothing changes: progress stays on that rep's device only.

You do this once. Plan on about 15 minutes. You need the Google account that should own the sheet (the same account that should send the alert email).

## 1. Make the spreadsheet

1. Go to [https://sheets.google.com](https://sheets.google.com) and create a blank spreadsheet.
2. Name it `IronRidge University Progress`.
3. Leave the grid empty. The script adds the tabs it needs the first time a rep signs in.

## 2. Open the script editor

1. In that spreadsheet, click **Extensions**, then **Apps Script**.
2. If Google shows a file named `Code.gs` with a sample `myFunction`, select all of that text and delete it.
3. Open `apps-script/Code.gs` from this project, select the whole file, copy it, and paste it into the Apps Script editor.
4. Click the save icon (disk).

## 3. Set the two values at the top

At the top of `Code.gs` in the Apps Script editor:

1. **ALERT_EMAILS** — who gets race alerts and feedback. Use the addresses you actually read. Quotes and commas matter. Example:

   `var ALERT_EMAILS = ["you@ironridgesteel.com", "trainer@ironridgesteel.com"];`

   Leave it as `[]` only if you want rows saved with no email yet.

2. **SHARED_SECRET** — must be the same text reps type as the access code. Open `courses.js` in this project and copy the `accessCode` value (today that is `ironridge980`) into the quotes:

   `var SHARED_SECRET = "ironridge980";`

   If you change the access code later, change this secret to the same new value and redeploy (step 6).

You can leave the threshold numbers as they are. They are explained at the bottom of this page.

Click save again.

## 4. Deploy the web app

1. Click **Deploy**, then **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - Description: `IronRidge University progress`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**.
5. Google asks you to authorize the script. Click through **Review permissions**, pick your account, and allow access to the spreadsheet and to send email. If you see "Google hasn't verified this app", click **Advanced**, then **Go to … (unsafe)**. This is your own script.
6. Copy the **Web app URL**. It ends in `/exec`. Keep that tab open.

Check the deploy: paste the `/exec` URL into a browser tab. You should see:

`{"ok":true,"service":"ironridge-university"}`

If you see a Google error page instead, the deployment did not finish. Deploy again and choose **Anyone**.

## 5. Paste the URL into the site

1. Open `app.js` in this project.
2. The first line inside the file header area is:

   `var SYNC_URL = "";`

3. Paste your `/exec` URL between the quotes:

   `var SYNC_URL = "https://script.google.com/macros/s/________/exec";`

4. Save, commit, and deploy the site the way you usually publish `main` to GitHub Pages.

Until this URL is filled in, the live site does not call Google.

## 6. When you change the script later

Editing `Code.gs` does not update the live URL by itself.

1. Click **Deploy**, then **Manage deployments**.
2. Click the pencil on the existing web app.
3. Under Version, choose **New version**.
4. Click **Deploy**.

The `/exec` URL stays the same. You do not need to edit `SYNC_URL` again.

## What shows up in the sheet

- **Events** — one row each time a rep signs in, opens a lesson, finishes a lesson or video, submits a quiz, or finishes a course. The `flags` column explains a race when one was detected.
- **Progress** — one row per rep. `progressJson` is the full saved record the site restores on any device. The other columns are the readable summary (courses, quiz scores, attempts, total time).
- **Feedback** — messages from the **Send feedback** button in a lesson.
- **Alerts** — one row per race notice, and whether an email actually went out.

Reps still need the access code to sign in. Their name is the key: `Jane Doe` and `jane doe` are the same person. A different spelling is a different row.

## Alert thresholds

These sit at the top of `Code.gs`. Change them there, save, and redeploy a new version (step 6).

| Constant | Default | Email when |
| --- | --- | --- |
| `MIN_COURSE_FRACTION` | `0.30` | A course is finished in less than 30% of its expected minutes |
| `MIN_COURSE_MINUTES` | `10` | A course is finished in under 10 minutes |
| `LESSON_RACE_SECONDS` | `15` | A lesson or video is marked complete with under 15 seconds of time on screen |
| `QUIZ_GUESS_ATTEMPTS` | `4` | The same quiz is submitted 4 or more times without a pass |
| `MIN_TRACKED_LESSON_SHARE` | `0.5` | Speed emails wait until at least half the lessons in that course have recorded on-screen time, so older progress from before this timer is not treated as a race |
| `ALERTS_PER_REP_COURSE_PER_DAY` | `1` | At most one email per rep per course per day. Extra flags still appear on the Events tab |

A course email uses the **higher** of the 10-minute floor and 30% of the expected minutes. A quiz also flags when it is submitted before earlier lessons or videos were opened, or when those were only on screen for a few seconds.

Time is counted only while the lesson is the open tab. A rep who switches away is not charged that time.

## If something looks stuck

- Wrong access code on the site is unchanged. This sheet does not replace that check.
- If the `/exec` URL is wrong or the secret does not match, reps still train. Progress stays on the device, and the site retries the send later. They do not see an error.
- Feedback and race mail come from your Gmail, because the web app runs as you. Check spam the first time.
- `Send feedback` appears only after `SYNC_URL` is filled in.
