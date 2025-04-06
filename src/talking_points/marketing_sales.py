import csv

# Professions in "Marketing & Sales" group
marketing_sales_professions = [
    {"secondary_label": "Digital Marketer", "fun_labels": "Buzz Beast"},
    {"secondary_label": "Social Media Manager", "fun_labels": "Trend Tamer"},
    {"secondary_label": "Email Marketing Specialist", "fun_labels": "Inbox Instigator"},
    {"secondary_label": "SEO Specialist", "fun_labels": "Rank Ranger"},
    {"secondary_label": "PPC Manager", "fun_labels": "Click Captain"},
    {"secondary_label": "Marketing Consultant", "fun_labels": "Strategy Star"},
    {"secondary_label": "Sales Representative", "fun_labels": "Deal Driver"},
    {"secondary_label": "Affiliate Marketer", "fun_labels": "Link Lord"},
    {"secondary_label": "Brand Strategist", "fun_labels": "Brand Buccaneer"},
    {"secondary_label": "Market Research Analyst", "fun_labels": "Insight Investigator"},
]

# Talking points with domain references
talking_points = {
    "Digital Marketer": {
        "try_these": [
            "Wildest campaign you’ve brewed over a latte?",
            "Ever spiked clicks mid-espresso?",
            "SEO or PPC—which buzz beast’s your vibe?",
            "What’s your slickest ad win?",
            "Best Google Analytics trick—spill the tea!",
        ],
        "avoid_these": [
            "Your ads are so annoying—stop it!",
            "Why’d that campaign tank so hard?",
            "Marketing’s just spam—right?",
            "That click rate’s a joke—fix it!",
            "Digital’s overhyped—agree?",
        ]
    },
    "Social Media Manager": {
        "try_these": [
            "Craziest viral post you’ve tamed over coffee?",
            "Ever trended mid-cold brew?",
            "Insta or X—which platform’s your roar?",
            "What’s your quirkiest hashtag win?",
            "Best engagement hack—spill the trend tea!",
        ],
        "avoid_these": [
            "Your posts are so cringey—ugh!",
            "Social’s a waste of time—true?",
            "Why’d that reel flop so bad?",
            "You just post memes—right?",
            "No one follows you—admit it!",
        ]
    },
    "Email Marketing Specialist": {
        "try_these": [
            "Slickest subject line you’ve brewed up?",
            "Ever spiked opens over a cappuccino?",
            "Mailchimp or Klaviyo—which inbox rocks?",
            "What’s your smoothest campaign win?",
            "Best CTA twist—spill the instigator tea!",
        ],
        "avoid_these": [
            "Your emails are pure spam—stop!",
            "Why’s that open rate so low?",
            "Email’s dead—agree?",
            "That newsletter’s trash—fix it!",
            "You just clog inboxes—huh?",
        ]
    },
    "SEO Specialist": {
        "try_these": [
            "Craziest rank you’ve brewed over a doppio?",
            "Ever topped Google mid-latte?",
            "Ahrefs or SEMrush—which range’s your vibe?",
            "What’s your slickest keyword win?",
            "Best backlink hack—spill the ranger tea!",
        ],
        "avoid_these": [
            "Your SEO sank us—admit it!",
            "SEO’s just gaming search—right?",
            "Why’s that rank so pathetic?",
            "You can’t boost traffic—huh?",
            "Search is dying—true?",
        ]
    },
    "PPC Manager": {
        "try_these": [
            "Wildest Google Ads win you’ve brewed?",
            "Ever clicked big over cold brew?",
            "Search or display—which captain’s your click?",
            "What’s your quirkiest ad copy story?",
            "Best bid tweak—spill the PPC tea!",
        ],
        "avoid_these": [
            "Your ads waste cash—stop it!",
            "Why’s that CTR so lousy?",
            "PPC’s a scam—agree?",
            "That campaign flopped—fix it!",
            "You just burn budgets—right?",
        ]
    },
    "Marketing Consultant": {
        "try_these": [
            "Boldest strategy you’ve brewed over coffee?",
            "Ever saved a brand mid-mocha?",
            "HubSpot or intuition—which star’s your shine?",
            "What’s your smoothest client win?",
            "Best growth hack—spill the strategy tea!",
        ],
        "avoid_these": [
            "Your advice tanked us—admit it!",
            "Consulting’s just hot air—huh?",
            "Why’s that plan so vague?",
            "You’re too expensive—true?",
            "Your ideas flop—agree?",
        ]
    },
    "Sales Representative": {
        "try_these": [
            "Craziest deal you’ve driven over a brew?",
            "Ever closed a sale mid-flat white?",
            "Cold call or email—which drive’s your deal?",
            "What’s your slickest pitch win?",
            "Best objection flip—spill the driver tea!",
        ],
        "avoid_these": [
            "Your sales are so pushy—stop!",
            "Why’d that deal fall through?",
            "Sales is sleazy—right?",
            "You can’t close—admit it!",
            "That pitch was weak—ugh!",
        ]
    },
    "Affiliate Marketer": {
        "try_these": [
            "Wildest link win you’ve brewed up?",
            "Ever cashed in mid-espresso?",
            "Amazon or ClickBank—which lord’s your vibe?",
            "What’s your quirkiest commission story?",
            "Best promo hack—spill the link tea!",
        ],
        "avoid_these": [
            "Your links are spammy—stop it!",
            "Affiliate’s a scam—true?",
            "Why’s that payout so low?",
            "You just peddle junk—huh?",
            "No one clicks those—right?",
        ]
    },
    "Brand Strategist": {
        "try_these": [
            "Boldest brand vibe you’ve brewed over coffee?",
            "Ever shaped a logo mid-latte?",
            "Voice or visuals—which buccaneer’s your sail?",
            "What’s your smoothest rebrand win?",
            "Best brand story—spill the pirate tea!",
        ],
        "avoid_these": [
            "Your brand’s so bland—fix it!",
            "Why’d that identity flop?",
            "Branding’s just logos—huh?",
            "That strategy’s stale—redo it!",
            "You can’t sell a vibe—agree?",
        ]
    },
    "Market Research Analyst": {
        "try_these": [
            "Craziest insight you’ve brewed over a brew?",
            "Ever cracked a trend mid-cappuccino?",
            "Surveys or focus groups—which digs your vibe?",
            "What’s your slickest data win?",
            "Best consumer hack—spill the insight tea!",
        ],
        "avoid_these": [
            "Your data’s all wrong—admit it!",
            "Research is pointless—true?",
            "Why’s that report so dull?",
            "You just guess trends—huh?",
            "That insight’s useless—fix it!",
        ]
    }
}

# Generate CSV rows
rows = []
for profession in marketing_sales_professions:
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
with open("marketing_sales_talking_points.csv", "w", newline="") as csvfile:
    fieldnames = ["id", "secondary_profession", "try_these", "avoid_these", "text"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for row in rows:
        writer.writerow(row)

print("CSV file 'marketing_sales_talking_points.csv' has been created with 100 rows!")