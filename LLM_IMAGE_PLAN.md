# LLM Image Generation Integration Checklist

- [x] Install the `openai` npm package for server-side API calls.
- [x] Configure the API key and endpoint for Blackforestlabs (OpenAI-compatible).
- [x] Create `src/app/api/generate/route.ts`.
- [x] Accept POST requests with a prompt.
- [x] Use the OpenAI library to call the image generation endpoint.
- [x] Return the generated image URL in the response.
- [x] In `src/app/page.tsx`, update `handleSend` to POST to `/api/generate`.
- [x] On response, display the generated image in the chat.
- [x] Show loading and error states as needed.
- [x] Render images in the chat UI when the assistant's message contains an image URL.
- [x] (Optional) Show error messages in the chat if the API call fails.
- [x] (Optional) Add loading indicators and polish the UI.

---

We will check off each item as we complete it to ensure nothing is missed.

# Plan: Migrating to Multiple `ImageGenCard` Components

## Goal

Refactor the current single flipcard implementation in `page.tsx` to support multiple, independent image generation cards (`ImageGenCard`), each with its own state and UI. This will enable a modern, chat-like interface for generating and viewing multiple images.

---

## Steps

### 1. **Extract Card Logic into a Reusable Component**

- Create a new file: `components/ImageGenCard.tsx`.
- Move all card-related state and UI logic from `page.tsx` into this component.
- Props should include:
  - `input`, `isLoading`, `selectedOrientation`, `image`, `error`, `flipped`
  - Event handlers for updating state (`onInputChange`, `onGenerate`, `onFlip`, `onOrientationChange`)
- The card should be fully controlled by its parent via props and callbacks.

---

### 2. **Manage an Array of Card States in the Page**

- In `page.tsx`, replace the single card state variables with an array of card state objects.
- Each card state object should have:
  - `input: string`
  - `isLoading: boolean`
  - `selectedOrientation: string`
  - `image: string | null`
  - `error: string | null`
  - `flipped: boolean`
- Initialize with one card for UX continuity.

---

### 3. **Implement Add Card Functionality**

- Add a button (e.g., "+ Add Card") to append a new card state to the array.
- Each new card starts with default values.

---

### 4. **Render Multiple Cards**

- Map over the array of card states and render an `ImageGenCard` for each.
- Pass down state and handlers as props.
- Ensure each card can be independently controlled and updated.

---

### 5. **Handle State Updates for Individual Cards**

- Implement update functions in `page.tsx` that update only the relevant card in the array (using index or unique ID).
- Pass these update functions to each `ImageGenCard`.

---

### 6. **Polish UI for Multiple Cards**

- Arrange cards in a vertical or chat-like layout (e.g., flex column with gaps).
- Optionally, allow cards to be removed or reordered for better UX.

---

### 7. **Testing and Validation**

- Test adding, flipping, generating, and interacting with multiple cards.
- Ensure state isolation between cards.
- Confirm accessibility and responsive design.

---

## Example Structure

```
src/
  app/
    page.tsx         // Manages array of card states, renders multiple ImageGenCard
  components/
    ImageGenCard.tsx // Stateless, controlled card component
```

---

## Next Steps

- Review this plan.
- If approved, proceed to implement step-by-step, starting with the card extraction.
