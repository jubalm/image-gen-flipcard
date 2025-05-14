# LLM Image Generation Integration Checklist

- [x] Install the `openai` npm package for server-side API calls.
- [x] Configure the API key and endpoint for Blackforestlabs (OpenAI-compatible).
- [x] Create `src/app/api/generate/route.ts`.
- [x] Accept POST requests with a prompt.
- [x] Use the OpenAI library to call the image generation endpoint.
- [x] Return the generated image URL in the response.
- [ ] In `src/app/page.tsx`, update `handleSend` to POST to `/api/generate`.
- [ ] On response, display the generated image in the chat.
- [ ] Show loading and error states as needed.
- [ ] Render images in the chat UI when the assistant's message contains an image URL.
- [ ] (Optional) Show error messages in the chat if the API call fails.
- [ ] (Optional) Add loading indicators and polish the UI.

---
We will check off each item as we complete it to ensure nothing is missed.
