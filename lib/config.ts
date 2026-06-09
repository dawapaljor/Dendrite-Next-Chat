// Feature Flags Configuration for Chat Client Improvements

export const FEATURE_FLAGS = {
  // Controls the Smile icon button and category-based emoji popover
  enableEmojiPicker: process.env.NEXT_PUBLIC_ENABLE_EMOJI_PICKER !== 'false',

  // Controls the Microphone button, voice recording deck, and waveform audio player
  enableVoiceMessages: process.env.NEXT_PUBLIC_ENABLE_VOICE_MESSAGES !== 'false',

  // Controls the Plus button dropdown upload items (Images, Videos, Documents)
  enableMediaAttachments: process.env.NEXT_PUBLIC_ENABLE_MEDIA_ATTACHMENTS !== 'false',

  // Controls inline image/GIF previews and Microlink website preview cards
  enableLinkPreviews: process.env.NEXT_PUBLIC_ENABLE_LINK_PREVIEWS !== 'false',

  // Controls the Share Contact Card option in the Plus menu and the inline card renderer
  enableContactCardSharing: process.env.NEXT_PUBLIC_ENABLE_CONTACT_CARD_SHARING !== 'false',
};
