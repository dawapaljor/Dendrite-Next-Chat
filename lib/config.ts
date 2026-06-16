// Feature Flags Configuration for Chat Client Improvements
// Edit these boolean values directly to enable or disable specific features.

export const FEATURE_FLAGS = {
  // Controls the Smile icon button and category-based emoji popover
  enableEmojiPicker: true,

  // Controls the Microphone button, voice recording deck, and waveform audio player
  enableVoiceMessages: false,

  // Controls the Plus button dropdown upload items (Images, Videos, Documents)
  enableMediaAttachments: false,

  // Controls inline image/GIF previews and Microlink website preview cards
  enableLinkPreviews: true,

  // Controls the Share Contact Card option in the Plus menu and the inline card renderer
  enableContactCardSharing: true,

  // Controls encryption shield badges and trust highlights
  enableSecurityTrustIndicators: true,

  // Controls self-destructing/ephemeral timers and burning effects
  enableEphemeralMessages: true,
};
