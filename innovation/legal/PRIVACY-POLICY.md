# Privacy Policy

---

> **A note before you read this.**
>
> This is a starting draft, written without a lawyer. It describes what
> Countercite intends to do with your documents. Before it goes live on the
> site, the owner has to do one thing that has not been done yet: **read the
> actual contracts of every outside service listed in section 5 and confirm that
> what is written here matches what those contracts say.** A privacy policy that
> promises something a vendor's terms do not deliver is worse than no privacy
> policy, because it turns a vendor's behaviour into our broken promise.
>
> Every `[[FILL: ...]]` marker is something the owner still has to complete.

**Last updated: [[FILL: date]]**

---

## The short version

You upload an insurance policy and a denial letter. We read them, tell you where
they disagree, and then get rid of them on a schedule you control. We do not
train anything on them. We do not sell them. We do not show them to anyone
except the small number of services listed in section 5, which need to touch
them to do their part of the job.

The rest of this document is the same thing said carefully.

---

## 1. Who is responsible for your information

**[[FILL: legal entity name]]**, at **[[FILL: full street address, city, state,
ZIP]]**. Contact: **[[FILL: privacy contact email address]]**.

Countercite is run by one person. That is unusual for a company handling
documents like these, and you should know it. It means there is a very short
list of people who could see your files, and it also means there is no
compliance department. Section 7 says what that changes.

## 2. What we collect

**The documents you upload.** Insurance policies, denial letters, endorsements,
correspondence, and anything else you choose to add to a case.

These documents commonly contain your name, your address, the address of the
insured property, your policy number, your claim number, dates and details of a
loss, and sometimes financial or medical information you did not necessarily
think about when you uploaded them. **We treat everything in an uploaded
document as sensitive, because we cannot know in advance which parts are.**

**Your account information.** Your name, email address, the password hash, your
plan, and if you are a licensed professional, the licence number and state you
choose to give us.

**Payment information.** Handled entirely by our payment processor. **We never
see or store your card number.** We see the last four digits, the card brand,
and whether a payment succeeded.

**Basic usage information.** Which pages you visited, when, roughly where from,
what browser, and error logs. We use this to keep the service working and to
find bugs.

**What we do not collect.** We do not buy data about you from anyone. We do not
run advertising trackers. [[FILL: confirm this is true of your actual analytics
setup before publishing. If you use a third-party analytics service, name it in
section 5 and say what it sees.]]

## 3. What happens to a document, step by step

This is the section most privacy policies leave vague. Here it is concretely.

1. **You upload it.** It travels over an encrypted connection and is written to
   encrypted storage. It is associated with your account and with one case.
2. **If it is a scan or an image, it goes to an OCR service** to be turned into
   text, because a picture of a page cannot be searched. Only that document's
   pages go, nothing about your account. See section 5.
3. **The deterministic part of the analysis runs on our own servers.** Finding
   the citations in the denial letter, locating the matching provisions in the
   policy, spotting exceptions inside a provision, recording page numbers. None
   of this leaves our infrastructure.
4. **A small part of the analysis goes to a language model provider.** Only the
   narrow comparison is sent: a short passage from the denial letter, the
   matching passage from the policy, and a question about whether the second
   supports the first. **Not the whole document. Not your name, your address,
   your policy number, your claim number or your account details.** The provider
   sends back a yes or no with a confidence figure. See section 5.
5. **The findings are assembled and stored** with your case, each one carrying
   the document, the page and the quoted words.
6. **You review the findings**, and export what you want.
7. **The document stays where you put it until you delete it, or until the
   retention schedule in section 4 reaches it.**

**Nothing you upload is used to train, tune, improve or evaluate any model.**
Not ours, not a vendor's. If we ever want to use real documents to improve the
product, we will ask you first, in a way you have to say yes to, and you will be
able to say no and keep using Countercite exactly as before.

## 4. How long we keep things, and how you delete them

| What | How long | How you get rid of it sooner |
|---|---|---|
| **A document you upload** | Until you delete it, or **[[FILL: e.g. 12 months]]** after the case is closed, whichever comes first | Delete the document, or delete the case, from your account. It goes immediately |
| **Findings and drafts for a case** | Same as the documents | Delete the case |
| **A deleted item, in backups** | Up to **[[FILL: e.g. 30 days]]**, until the backup it appears in rotates out | Nothing. Backups expire on their own schedule and we do not surgically edit them |
| **Text sent to the model provider** | **[[FILL: the provider's actual retention period, from their contract. Do not guess this. Common terms are 0 days or 30 days for abuse monitoring. Read it and write the real number here.]]** | Not applicable |
| **Your account details** | While your account is open, then **[[FILL: e.g. 90 days]]** | Close your account and email us to ask for immediate deletion |
| **Payment records** | As long as tax and accounting law requires, usually several years | Nothing. We are required to keep these |
| **Server and error logs** | **[[FILL: e.g. 90 days]]** | Nothing. They rotate automatically |

**Deleting means deleting.** When you delete a document, it is removed from
active storage, not flagged as hidden. The only copy that survives is inside a
backup, which expires on the schedule above.

**Export before you go.** You can export your cases, findings and drafts at any
time, and for **[[FILL: 30]]** days after you close your account.

## 5. The outside services that touch your information

These are our subprocessors. Each one is here because it does a specific job we
cannot do ourselves, and each one sees only what that job requires.

| Service | What it is for | What it sees | Where |
|---|---|---|---|
| **[[FILL: hosting and storage provider]]** | Running the service, storing your documents | Everything you upload, encrypted at rest | [[FILL: region]] |
| **[[FILL: language model provider, named]]** | The single narrow comparison in step 4 above | Short passages from your documents. **Not the whole file, not your identity, not your policy or claim numbers** | [[FILL: region]] |
| **[[FILL: OCR provider, named, or "none, OCR runs on our own servers"]]** | Turning scanned pages into text | The pages of scanned documents only | [[FILL: region]] |
| **[[FILL: payment processor, e.g. Stripe]]** | Taking payment | Your name, email, billing details, card data. **We never see the card** | [[FILL: region]] |
| **[[FILL: email provider]]** | Account emails, receipts, support replies | Your email address and the contents of those emails | [[FILL: region]] |
| **[[FILL: error monitoring or analytics, or "none"]]** | Finding bugs | [[FILL: be specific. If it can capture document contents in an error report, say so, and turn that off]] | [[FILL: region]] |

**We will tell you before we add a new one.** If we bring in another service
that processes your documents, we will update this table and email you at least
**[[FILL: 14]]** days before it starts, so you can leave if you do not want it.

**A limitation worth stating.** We choose these vendors and we read their terms,
but we do not control their internal security. If one of them is breached, your
documents could be exposed through them. That is true of every online service
and it is true of this one.

## 6. Who we do not give your information to

- **We do not sell it.** Not to anyone, not in any form.
- **We do not share it for advertising**, and we do not run advertising.
- **We never send it to your insurance company**, or to any insurer, or to any
  adjuster, lawyer, contractor or lead buyer. Countercite has no relationship
  with any insurance company and takes no money from any of them.
- **We do not share one customer's documents with another customer**, including
  where a public adjuster and their client both use Countercite. Each account
  sees only its own cases.

We will disclose information if a court order, subpoena or law requires it. If
that happens we will tell you before we comply, unless we are legally forbidden
from telling you.

If the business is ever sold, your information moves with it, and we will tell
you before that happens so you can delete your account first if you prefer.

## 7. How we protect it, and what we cannot promise

What we do:

- Encrypted connections for everything, and encrypted storage for documents.
- Access limited to the accounts that need it. Today that is one person.
- Two-factor authentication on every administrative account and every vendor
  account.
- Documents scoped to a single customer account with no cross-account access.
- [[FILL: add anything else that is actually true. Do not list a control you
  have not implemented. An unmet security promise is a deceptive practice.]]

What we cannot promise: that no system is ever breached. No one can. **If your
documents are exposed in a breach, we will tell you promptly, tell you what was
in it, and tell you what we are doing.** We will do that whether or not the law
of your state requires it, and we will not wait for a lawyer to draft something
before telling you something happened.

## 8. Your choices

Wherever you live, you can:

- **See what we hold** about you.
- **Correct** anything wrong in your account.
- **Delete** any document, any case, or your whole account.
- **Export** your documents and findings.
- **Leave**, and take your data with you.

To do any of these, use your account settings or email **[[FILL: privacy contact
email]]**. We will respond within **[[FILL: 30]]** days.

Some states give residents additional formal rights. [[FILL: a note on this.
Based on research, the thresholds in the four launch states probably do not
reach a solo operator: the Texas Data Privacy and Security Act exempts
businesses that are small businesses under the SBA definition; the California
CCPA/CPRA thresholds start around $25 million in revenue or 100,000 consumers;
the Florida Digital Bill of Rights is aimed at companies above $1 billion in
revenue. All of that is from secondary sources and none of it was read in the
statute. The right posture is not to argue about whether the thresholds apply.
Give everyone the rights listed above regardless, which costs nothing at this
size, and revisit when the business is larger.]]

## 9. Cookies

We use the cookies needed to keep you logged in and to keep the site secure.
[[FILL: if you use anything beyond strictly necessary cookies, say exactly what
and why, and give people a way to turn it off.]]

## 10. Children

Countercite is not for anyone under 18 and we do not knowingly collect
information from anyone under 18.

## 11. Changes

We will post changes here with a new date at the top. If a change affects what
happens to your documents, we will email you at least **[[FILL: 30]]** days
before it takes effect. Old versions stay available at [[FILL: URL]].

---

**Privacy questions, or a deletion request: [[FILL: privacy contact email
address]].** A person reads that inbox, and it is the same person who built the
service.
