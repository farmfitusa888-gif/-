# The platform gate — what an iPhone can actually do alone, in 2026

Researched 2026-08-28. Every idea in this project depends on these four facts.
If any of them were false, the whole thesis (AI product + no server + zero
marginal cost) would be impossible and the honest answer would be "cannot be
built."

## 1. Long-form speech-to-text, on device, free

`SpeechAnalyzer` / `SpeechTranscriber` — Apple's speech framework, iOS 26+.
Purpose-built for long-form multi-speaker audio (meetings, lectures,
conversations), which is exactly the shape of every idea here.

- **2.12% WER** on LibriSpeech clean, **4.56%** on noisy [review]
- Beats Whisper Small (3.74% clean) and runs **~2x faster than Whisper
  Large v3 Turbo** [review]
- Runs on device, no network, no per-minute fee

**This is the single most important enabler.** Cloud transcription is the main
per-customer cost in every AI scribe product on the market. It just became free
and local.

**The catch, stated up front:** `SpeechTranscriber` covers ~30 locales, and the
new framework **dropped the custom-vocabulary feature** the legacy framework
had. Domain jargon — drug names, legal terms of art, diagnostic codes — is
therefore the known weak point, and a correction layer is a product requirement
in every brief, not an optional extra.

## 2. An on-device LLM, free — with a hard limit that shapes the architecture

Two routes, and the difference matters:

| | Apple Foundation Models | Ship your own (MLX-Swift) |
|---|---|---|
| Model | ~3B, system-provided | Qwen / Llama / Gemma class, your choice |
| **Context** | **4,096 tokens, input + output combined** | Your choice; larger |
| App size cost | zero | hundreds of MB to GB |
| Availability | Apple Intelligence devices only | any modern iPhone |
| Speed | system-optimised | ~61 tok/s (Qwen 3.5 2B, MLX) [review] |

**The 4,096-token ceiling is the defining constraint of this whole project.**
A 50-minute session transcribes to roughly 7,500 words — about 10,000 tokens.
It does not fit. There is no version of "just send the transcript to the model."

So the architecture in every brief is the same and it is deliberate:

> **Chunk → extract structured facts per chunk → fold the facts → render.**

The model never sees the whole transcript. It sees a slice and returns typed
data (Foundation Models' guided generation emits a Swift type, not free text).
The facts accumulate in a structure the app owns. The document is rendered from
that structure by ordinary code.

This is worth saying plainly because it is an advantage, not a workaround:
a fold over typed extractions is auditable, every field can carry which slice of
audio produced it, and a hallucinated fact has nowhere to hide. A single
end-to-end "summarise this" prompt has none of those properties.

## 3. Images in the prompt

As of WWDC26 the on-device model accepts images directly in prompts, and the
framework was opened to conforming third-party LLM providers. Document and scene
understanding is therefore on the table locally.

## 4. What this adds up to

| Cost line | Cloud AI product | This shape |
|---|---|---|
| Transcription | per minute | **$0** |
| Inference | per token | **$0** |
| Storage | per GB | customer's own iCloud, **$0** |
| Marginal cost per customer | real, grows with use | **$0** |

Zero marginal cost is what makes flat-and-unlimited pricing survivable against a
field that meters. It is also what makes the offline and privacy claims true
rather than marketing — there is no server to subpoena, breach, or bill.

## What is NOT established

- **No number here was measured on a device.** All are read from Apple's
  documentation or third-party benchmark write-ups.
- **WER on real field audio is unknown.** LibriSpeech is read audiobook speech.
  A crying child, a barn, a moving ambulance, a courtroom, an accented speaker
  and a bad room are all absent from that benchmark. Every brief that depends on
  transcription quality names this as its gating test.
- **Speaker diarisation quality is not established** and matters enormously to
  several ideas. Not found; not measured.

