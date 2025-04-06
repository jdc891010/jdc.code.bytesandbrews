import csv

# Professions in "Writing & Content Creation" group
writing_content_professions = [
    {"secondary_label": "Copywriter", "fun_labels": "Word Weaver"},
    {"secondary_label": "Content Writer", "fun_labels": "Story Spinner"},
    {"secondary_label": "Technical Writer", "fun_labels": "Tech Teller"},
    {"secondary_label": "Journalist", "fun_labels": "News Nomad"},
    {"secondary_label": "Blogger", "fun_labels": "Blog Bard"},
    {"secondary_label": "Editor/Proofreader", "fun_labels": "Grammar Guru"},
    {"secondary_label": "Scriptwriter", "fun_labels": "Script Scribe"},
    {"secondary_label": "Social Media Content Creator", "fun_labels": "Post Prodigy"},
    {"secondary_label": "SEO Specialist", "fun_labels": "Search Sage"},
    {"secondary_label": "Author", "fun_labels": "Tale Titan"},
]

# Talking points with domain references
talking_points = {
    "Copywriter": {
        "try_these": [
            "Best tagline you’ve spun over a latte?",
            "Ever nailed an ad with one word?",
            "What’s your quirkiest client pitch story?",
            "Short copy or long—which brews your vibe?",
            "Google Docs or Word—pick your weave tool!",
        ],
        "avoid_these": [
            "Your ads are so dull—spice it up!",
            "Why’d that campaign bomb so hard?",
            "Copywriting’s just slogans, huh?",
            "That pitch was weak—redo it!",
            "Words don’t sell—agree?",
        ]
    },
    "Content Writer": {
        "try_these": [
            "Wildest blog hook you’ve brewed up?",
            "Ever spun a tale over cold brew?",
            "Narrative or listicle—which story’s your jam?",
            "What’s your slickest 500-word win?",
            "Best keyword twist—spill the spinner tea!",
        ],
        "avoid_these": [
            "Why’s your content so boring?",
            "You just fluff words, right?",
            "That post’s a snooze—fix it!",
            "Writing’s too easy—true?",
            "No one reads blogs anymore, huh?",
        ]
    },
    "Technical Writer": {
        "try_these": [
            "Craziest manual you’ve brewed over coffee?",
            "Ever simplified tech mid-espresso?",
            "Markdown or Word—which tech’s your tell?",
            "What’s your smoothest doc win?",
            "Best jargon hack—spill the teller tea!",
        ],
        "avoid_these": [
            "Your docs are so confusing—ugh!",
            "Tech writing’s dry—admit it!",
            "Why’s that guide so long?",
            "You just copy manuals, huh?",
            "No one reads instructions—right?",
        ]
    },
    "Journalist": {
        "try_these": [
            "Wildest scoop you’ve nabbed over a brew?",
            "Ever filed a story mid-latte?",
            "Print or digital—which news nomad’s you?",
            "What’s your quirkiest interview win?",
            "Best lead line—spill the scoop tea!",
        ],
        "avoid_these": [
            "Your story’s fake news—true?",
            "Why’d that piece flop so bad?",
            "Journalism’s dead—agree?",
            "That headline’s lame—fix it!",
            "You just chase clicks, huh?",
        ]
    },
    "Blogger": {
        "try_these": [
            "Craziest post you’ve brewed up lately?",
            "Ever typed a rant over a cappuccino?",
            "WordPress or Medium—which bard’s your vibe?",
            "What’s your slickest viral win?",
            "Best blog hack—spill the bardic tea!",
        ],
        "avoid_these": [
            "Your blog’s so outdated—update it!",
            "Blogging’s not real writing, huh?",
            "Why’s that post so wordy?",
            "No one cares about blogs—right?",
            "You just ramble—admit it!",
        ]
    },
    "Editor/Proofreader": {
        "try_these": [
            "Wildest typo you’ve fixed over coffee?",
            "Ever polished a draft mid-mocha?",
            "Grammarly or manual—which guru’s your brew?",
            "What’s your smoothest edit win?",
            "Best red-pen story—spill the tea!",
        ],
        "avoid_these": [
            "You missed that typo—sloppy!",
            "Editing’s just nitpicking, huh?",
            "Why’s your edit so harsh?",
            "That draft’s still bad—fix it!",
            "Proofing’s boring—true?",
        ]
    },
    "Scriptwriter": {
        "try_these": [
            "Craziest scene you’ve scripted over a brew?",
            "Ever penned a twist mid-flat white?",
            "Celtx or Final Draft—which scribe’s your vibe?",
            "What’s your slickest dialogue win?",
            "Best plot hook—spill the script tea!",
        ],
        "avoid_these": [
            "Your script’s so predictable—ugh!",
            "Why’s that scene so flat?",
            "Scripting’s just words—right?",
            "That twist sucked—redo it!",
            "You can’t write drama—agree?",
        ]
    },
    "Social Media Content Creator": {
        "try_these": [
            "Wildest TikTok you’ve brewed up lately?",
            "Ever posted a banger over espresso?",
            "Insta or X—which post’s your prodigy?",
            "What’s your quirkiest viral win?",
            "Best hashtag hack—spill the tea!",
        ],
        "avoid_these": [
            "Your posts are so cringe—stop it!",
            "Social media’s a waste—true?",
            "Why’d that reel flop?",
            "You just chase likes, huh?",
            "That caption’s lame—fix it!",
        ]
    },
    "SEO Specialist": {
        "try_these": [
            "Craziest rank you’ve brewed up over coffee?",
            "Ever topped Google mid-latte?",
            "Ahrefs or SEMrush—which sage’s your brew?",
            "What’s your slickest keyword win?",
            "Best SEO trick—spill the search tea!",
        ],
        "avoid_these": [
            "Your SEO’s why we sank—admit it!",
            "SEO’s just gaming Google, huh?",
            "Why’s that rank so low?",
            "You can’t boost traffic—right?",
            "Search is dead—agree?",
        ]
    },
    "Author": {
        "try_these": [
            "Wildest chapter you’ve brewed over a doppio?",
            "Ever penned an epic mid-cold brew?",
            "Scrivener or pen—which tale’s your titan?",
            "What’s your smoothest plot twist win?",
            "Best book idea—spill the epic tea!",
        ],
        "avoid_these": [
            "Your book’s so dull—scrap it!",
            "Why’s that chapter so long?",
            "Writing novels is pointless—huh?",
            "That ending sucked—fix it!",
            "You’ll never sell—true?",
        ]
    }
}

# Generate CSV rows
rows = []
for profession in writing_content_professions:
    sec_prof = profession["secondary_label"]
    for i, text in enumerate(talking_points[sec_prof]["try_these"], 1):
        rows.append({
            "id": f"T{i}-{sec_prof}",
            "secondary_profession": sec_prof,
            "try_these": True,
            "avoid_these": False,
            "text": text
        })
    for i, text in enumerate(talking_points[sec_prof]["avoid_these"], 1):
        rows.append({
            "id": f"A{i}-{sec_prof}",
            "secondary_profession": sec_prof,
            "try_these": False,
            "avoid_these": True,
            "text": text
        })

# Write to CSV
with open("writing_content_talking_points.csv", "w", newline="") as csvfile:
    fieldnames = ["id", "secondary_profession", "try_these", "avoid_these", "text"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for row in rows:
        writer.writerow(row)

print("CSV file 'writing_content_talking_points.csv' has been created with 100 rows!")