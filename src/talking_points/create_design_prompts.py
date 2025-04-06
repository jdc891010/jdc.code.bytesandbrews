import csv

# Professions in "Creative & Design" group
creative_design_professions = [
    {"secondary_label": "Graphic Designer", "fun_labels": "Pixel Pixie"},
    {"secondary_label": "UI/UX Designer", "fun_labels": "Interface Imp"},
    {"secondary_label": "Illustrator", "fun_labels": "Sketch Sorcerer"},
    {"secondary_label": "Video Editor", "fun_labels": "Frame Fiend"},
    {"secondary_label": "Motion Graphics Designer", "fun_labels": "Motion Maestro"},
    {"secondary_label": "3D Animator", "fun_labels": "Depth Dancer"},
    {"secondary_label": "Photographer", "fun_labels": "Lens Luminary"},
    {"secondary_label": "Art Director", "fun_labels": "Vision Vanguard"},
    {"secondary_label": "Web Designer", "fun_labels": "Digital Decorator"},
    {"secondary_label": "Game Designer", "fun_labels": "Playmaker"},
]

# Talking points with domain references
talking_points = {
    "Graphic Designer": {
        "try_these": [
            "Fave font duo you’ve brewed up lately?",
            "Ever sketched a logo over a latte?",
            "What’s your wildest Photoshop layer win?",
            "Bold or minimal—which vibe’s your brew?",
            "Illustrator or Affinity—pick your pixie tool!",
        ],
        "avoid_these": [
            "Your designs are so basic—step it up!",
            "Why’s that color palette so loud?",
            "Can’t you just use Canva instead?",
            "That logo’s a flop—redo it fast!",
            "Graphic design’s not real work, huh?",
        ]
    },
    "UI/UX Designer": {
        "try_these": [
            "Slickest Figma prototype you’ve crafted?",
            "Ever tested a flow over cold brew?",
            "Wireframe or mockup—which brews better?",
            "What’s your quirkiest user feedback win?",
            "Best UX hack—spill the interface tea!",
        ],
        "avoid_these": [
            "Why’s your app so hard to use?",
            "UI’s just pretty pictures, right?",
            "That flow’s a mess—fix it!",
            "You just copy other designs, huh?",
            "UX is overrated—agree?",
        ]
    },
    "Illustrator": {
        "try_these": [
            "Craziest sketch you’ve inked over coffee?",
            "Procreate or pencil—which vibe’s your spell?",
            "What’s your smoothest vector win?",
            "Ever doodled a masterpiece mid-brew?",
            "Best tablet trick—spill the sorcery!",
        ],
        "avoid_these": [
            "Your drawings look childish—grow up!",
            "Why’s that sketch so sloppy?",
            "Illustrating’s just doodling, huh?",
            "That art’s ugly—try harder!",
            "You can’t make money with this, right?",
        ]
    },
    "Video Editor": {
        "try_these": [
            "Wildest Premiere cut you’ve brewed up?",
            "Ever synced a clip over an espresso?",
            "After Effects or DaVinci—which frame’s your jam?",
            "What’s your slickest transition story?",
            "Best edit hack—spill the reel tea!",
        ],
        "avoid_these": [
            "Why’s your video so choppy?",
            "You just slap clips together, huh?",
            "That cut’s awful—redo it!",
            "Editing’s so tedious—true?",
            "Your footage looks cheap—admit it!",
        ]
    },
    "Motion Graphics Designer": {
        "try_these": [
            "Craziest After Effects move you’ve spun?",
            "Ever animated over a flat white?",
            "2D or 3D—which motion brews your buzz?",
            "What’s your smoothest keyframes win?",
            "Best animation trick—spill the maestro tea!",
        ],
        "avoid_these": [
            "Your graphics are too flashy—tone it down!",
            "Why’s that animation so laggy?",
            "Motion’s just eye candy, right?",
            "That loop’s boring—fix it!",
            "You can’t animate well—agree?",
        ]
    },
    "3D Animator": {
        "try_these": [
            "Wildest Blender rig you’ve brewed up?",
            "Ever rendered a scene over a mocha?",
            "Maya or Unity—which depth’s your dance?",
            "What’s your quirkiest 3D character win?",
            "Best rigging hack—spill the 3D tea!",
        ],
        "avoid_these": [
            "Why’s your model so glitchy?",
            "3D’s too slow—who cares?",
            "That render’s ugly—scrap it!",
            "You just copy game assets, huh?",
            "Animation’s a waste—true?",
        ]
    },
    "Photographer": {
        "try_these": [
            "Craziest shot you’ve snapped over coffee?",
            "Lightroom or Capture One—which lens shines?",
            "What’s your smoothest shutter win?",
            "Ever caught a vibe mid-brew?",
            "Best photo hack—spill the luminary tea!",
        ],
        "avoid_these": [
            "Your pics are blurry—fix them!",
            "Why’s that edit so overdone?",
            "Anyone can take photos—right?",
            "That shot’s dull—try harder!",
            "Photography’s not art—agree?",
        ]
    },
    "Art Director": {
        "try_these": [
            "Boldest vision you’ve brewed up lately?",
            "Ever led a shoot over a cappuccino?",
            "Mood board or sketch—which vibe’s your spark?",
            "What’s your quirkiest campaign win?",
            "Best creative call—spill the vanguard tea!",
        ],
        "avoid_these": [
            "Your direction’s all over—focus!",
            "Why’d that campaign flop?",
            "Art direction’s just bossing, huh?",
            "That concept’s lame—redo it!",
            "You’re too artsy—tone it down!",
        ]
    },
    "Web Designer": {
        "try_these": [
            "Slickest site layout you’ve brewed?",
            "Ever mocked up a page over cold brew?",
            "Figma or Sketch—which tool’s your decor?",
            "What’s your wildest design win?",
            "Best web vibe—spill the digital tea!",
        ],
        "avoid_these": [
            "Why’s your site so cluttered?",
            "You just use templates, right?",
            "That design’s outdated—ugh!",
            "Web design’s too easy—true?",
            "Your colors clash—fix it!",
        ]
    },
    "Game Designer": {
        "try_these": [
            "Craziest game mechanic you’ve brewed up?",
            "Ever built a level over a latte?",
            "Unity or Unreal—which play’s your vibe?",
            "What’s your smoothest gameplay win?",
            "Best game hack—spill the playmaker tea!",
        ],
        "avoid_these": [
            "Why’s your game so buggy?",
            "Games are for kids—agree?",
            "That level’s awful—scrap it!",
            "You just copy other games, huh?",
            "Game design’s a fad—right?",
        ]
    }
}

# Generate CSV rows
rows = []
for profession in creative_design_professions:
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
with open("creative_design_talking_points.csv", "w", newline="") as csvfile:
    fieldnames = ["id", "secondary_profession", "try_these", "avoid_these", "text"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for row in rows:
        writer.writerow(row)

print("CSV file 'creative_design_talking_points.csv' has been created with 100 rows!")