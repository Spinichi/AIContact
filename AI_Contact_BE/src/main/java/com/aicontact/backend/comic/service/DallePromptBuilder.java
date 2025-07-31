package com.aicontact.backend.comic.service;

import org.springframework.stereotype.Component;

@Component
public class DallePromptBuilder {

    public String build(String gptOutput) {
        return """
        You are the best cartoonist in the world from now on.
        Create a single image divided into 4 comic panels. Each panel must represent ONE and ONLY ONE of the scenes below. Do not merge scenes into a single panel. Do not overlap content between panels. Each panel is an isolated event. Use clear white gutters between each panel. 
        Each panel must represent exactly one distinct moment in a short story featuring a cute couple in their 20s. The couple should have big-head, cartoonish proportions, in a soft and expressive animated style (like Pixar or DreamWorks baby characters).
        Do not overlap scenes or merge them. Each panel is an isolated moment with distinct composition, lighting, and background setting.

        ⚠️ Important instructions:
        - Do not combine multiple scenes into one panel. Each panel must depict exactly one event described below. 
        - Ensure each panel has clear visual separation (like borders or gutters) so viewers can easily distinguish between scenes.
        - I want a couple to come out together rather than alone. Of course, it doesn't matter if no one comes out with a background depending on the situation. 

        Art Direction:
        - No text, speech bubbles, or captions
        - Use warm, cinematic lighting and immersive backgrounds
        - Reflect the summer weather through sunlight, clothing (short sleeves, fans, cold drinks), and atmosphere
        - Focus on expressive facial reactions, body gestures, and the couple’s emotional connection
        - Please don't let outsiders appear as the main characters other than couples, it's okay to appear in the background

        Use the *same couple characters* in all six panels.
        Their faces, hairstyles, body types, and clothing must remain consistent across all panels.
        Do not change their appearance or swap their roles in any scene.

        📖 Scene progression (exactly one scene per panel):
        %s

        - Panel 1 refers to the upper left, panel 2 refers to the upper right, panel 3 refers to the lower left, and panel 4 refers to the lower right of the image.
        - Please follow all of my directions above
        - And please make sure that each cut follows that panel's description, and never let a similar scene come out, please!
        """.formatted(gptOutput);
    }
}

