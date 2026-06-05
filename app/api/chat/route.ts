import { NextRequest, NextResponse } from "next/server";

// Fallback high-quality conversational responses
const FALLBACK_RESPONSES = [
  {
    keywords: ["spacing", "padding", "margin", "baseline"],
    reply: "Absolutely, I spent a lot of time adjusting the padding-x and margins to fit the 4px baseline grid. It really makes the layout feel unified and highly professional!"
  },
  {
    keywords: ["dashboard", "clean", "ui", "component"],
    reply: "Yeah! That dashboard mockup uses a high-contrast slate theme. I centered the metrics cards to optimize empty space. Do you think we should shrink the border-radius from xl to md?"
  },
  {
    keywords: ["dark", "theme", "mode", "color"],
    reply: "I love the dark mode variation! Cozy, low-light workspace vibes are the best for deep focus sessions. We must make sure the contrast ratios strictly exceed 4.5:1."
  },
  {
    keywords: ["implement", "code", "next", "chat"],
    reply: "Let's definitely start implementing the interactive chat components! I can outline the React hook structure first and then construct the responsive layouts."
  },
  {
    keywords: ["prototype", "design", "figma", "assets"],
    reply: "The visual assets turned out extremely crisp! I exported the SVG assets and standard PNG files. Check out the share links in our shared assets channel."
  },
  {
    keywords: ["group", "channel", "team", "chat"],
    reply: "Adding group workspaces will definitely streamline our design reviews. It's great to select team members and align on the layout instantly!"
  }
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lowerMessage = message.toLowerCase();

    // High quality Rule-Based Responses
    for (const rule of FALLBACK_RESPONSES) {
      if (rule.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return NextResponse.json({ 
          reply: rule.reply, 
          source: "offline_rules" 
        });
      }
    }

    // Default creative response if no keywords match
    const defaultReplies = [
      `That sounds very interesting! I think aligning our UI components with a functional minimalist design is exactly what we need right now. Let's iterate on this.`,
      `Outstanding! Spacing, micro-interactions, and typography scale are what truly make our designs pop. I'll take a look at the grid structure.`,
      `Awesome point, let's explore how we want to organize the new screens. I'll create a quick prototype layout of the group channel flow next.`,
      `Let me inspect the responsive viewport rules for this view. I think setting full-width flex spaces with a subtle border outline keeps it clean.`
    ];

    const randomReply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    return NextResponse.json({ 
      reply: randomReply, 
      source: "offline_default" 
    });

  } catch (error: any) {
    console.error("API Error in Route Handlers:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
