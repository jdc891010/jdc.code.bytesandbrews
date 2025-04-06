import csv

# Professions in "Technology & IT" group
tech_it_professions = [
    {"secondary_label": "Software Developer", "fun_labels": "Code Conjurer"},
    {"secondary_label": "Web Developer", "fun_labels": "Web Wizard"},
    {"secondary_label": "Mobile App Developer", "fun_labels": "App Alchemist"},
    {"secondary_label": "DevOps Engineer", "fun_labels": "Cloud Commander"},
    {"secondary_label": "Systems Administrator", "fun_labels": "Server Sage"},
    {"secondary_label": "Cybersecurity Analyst", "fun_labels": "Hack Halter"},
    {"secondary_label": "Data Scientist", "fun_labels": "Data Dynamo"},
    {"secondary_label": "Machine Learning Engineer", "fun_labels": "AI Architect"},
    {"secondary_label": "IT Support Specialist", "fun_labels": "Tech Troubleshooter"},
    {"secondary_label": "Cloud Architect", "fun_labels": "Sky Sculptor"},
]

# Talking points with domain references
talking_points = {
    "Software Developer": {
        "try_these": [
            "Spill the beans - what's your wildest Python hack?",
            "Ever debugged a Java mess over a latte?",
            "Favorite IDE: VS Code or Vim? Brews on me!",
            "What's the quirkiest Git commit you've pushed?",
            "Rust or C++ - which byte brews your vibe?",
        ],
        "avoid_these": [
            "Why's your code always crashing?",
            "You still use outdated languages, huh?",
            "Can't you just Google that bug?",
            "Your commits are a mess, right?",
            "Coding's so dull - why bother?",
        ]
    },
    "Web Developer": {
        "try_these": [
            "Best CSS flexbox trick you've brewed up?",
            "Ever coded a React site over cold brew?",
            "Chrome or Firefox - which browser's your jam?",
            "What's your slickest JavaScript hack?",
            "Tailwind or Bootstrap - pick your web potion!",
        ],
        "avoid_these": [
            "Why do your sites load so slow?",
            "You just steal HTML templates, huh?",
            "Web dev's dead with AI - agree?",
            "That CSS is a nightmare - fix it!",
            "Your pages look ancient already.",
        ]
    },
    "Mobile App Developer": {
        "try_these": [
            "Craziest Swift feature you've coded?",
            "Ever built an Android app over espresso?",
            "Flutter or Kotlin - which byte's your brew?",
            "What's your smoothest app store win?",
            "Best UI tweak - spill the mobile tea!",
        ],
        "avoid_these": [
            "Why's your app full of bugs?",
            "iOS devs are snobs, right?",
            "That last update broke everything!",
            "Mobile apps are pointless now, huh?",
            "You just copy other apps, don't you?",
        ]
    },
    "DevOps Engineer": {
        "try_these": [
            "Wildest Docker container you've spun up?",
            "Ever fixed a CI/CD pipeline over coffee?",
            "Kubernetes or Jenkins - which rules your cloud?",
            "What's your slickest automation brew?",
            "Terraform or Ansible - pick your DevOps vibe!",
        ],
        "avoid_these": [
            "Why'd the server crash again?",
            "DevOps is just buzzword nonsense, huh?",
            "You broke the build - admit it!",
            "Can't you just do it manually?",
            "Your pipelines are too slow - ugh!",
        ]
    },
    "Systems Administrator": {
        "try_these": [
            "Best Linux command you've brewed up?",
            "Ever rebooted a server over a cappuccino?",
            "Windows or Ubuntu - which byte's your jam?",
            "What's your quirkiest uptime story?",
            "Bash script win - spill the sysadmin tea!",
        ],
        "avoid_these": [
            "Why's the network always down?",
            "You just restart stuff, right?",
            "Servers are obsolete - agree?",
            "That outage was your fault, huh?",
            "Sysadmins are so boring - true?",
        ]
    },
    "Cybersecurity Analyst": {
        "try_these": [
            "Craziest hack you've halted over coffee?",
            "Ever caught a phishing scam mid-latte?",
            "Wireshark or Nmap - which tool's your vibe?",
            "What's your slickest firewall tweak?",
            "Best pen-test story - spill the byte beans!",
        ],
        "avoid_these": [
            "Why'd you let that breach happen?",
            "Security's just paranoia, huh?",
            "You hack people too, right?",
            "That VPN's useless - admit it!",
            "Cyber's overhyped - agree?",
        ]
    },
    "Data Scientist": {
        "try_these": [
            "Wildest Pandas trick you've brewed up?",
            "Ever crunched data over a doppio?",
            "R or Python - which stat's your brew?",
            "What's your smoothest visualization win?",
            "Best dataset find - spill the data tea!",
        ],
        "avoid_these": [
            "Your models are always wrong, huh?",
            "Data science is just guesswork, right?",
            "Why's your graph so confusing?",
            "You just play with Excel - true?",
            "Stats are boring - admit it!",
        ]
    },
    "Machine Learning Engineer": {
        "try_these": [
            "Craziest TensorFlow model you've trained?",
            "Ever tuned an AI over a flat white?",
            "PyTorch or Keras - which byte's your buzz?",
            "What's your slickest neural net win?",
            "Best overfitting fix - spill the ML tea!",
        ],
        "avoid_these": [
            "Why's your AI so dumb?",
            "ML's all hype - no results, huh?",
            "You just copy GitHub code, right?",
            "That model's a flop - fix it!",
            "AI's taking over - scared yet?",
        ]
    },
    "IT Support Specialist": {
        "try_these": [
            "Wildest tech fix you've brewed up?",
            "Ever solved a ticket over a mocha?",
            "Windows or Mac - which OS brews better?",
            "What's your quirkiest user story?",
            "Best troubleshooting hack - spill it!",
        ],
        "avoid_these": [
            "Why can't you fix it faster?",
            "IT support's just rebooting, huh?",
            "You broke my laptop - admit it!",
            "Tech's fine - stop bothering me!",
            "Your help's useless - true?",
        ]
    },
    "Cloud Architect": {
        "try_these": [
            "Craziest AWS setup you've brewed?",
            "Ever scaled a cloud over cold brew?",
            "Azure or GCP - which sky's your vibe?",
            "What's your slickest migration win?",
            "Best cloud hack - spill the byte tea!",
        ],
        "avoid_these": [
            "Why's the cloud always down?",
            "You just bill us more, huh?",
            "Cloud's too complex - agree?",
            "That outage was your fault, right?",
            "On-prem's better - admit it!",
        ]
    }
}

# Generate CSV rows
rows = []
for profession in tech_it_professions:
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
with open("tech_it_talking_points.csv", "w", newline="") as csvfile:
    fieldnames = ["id", "secondary_profession", "try_these", "avoid_these", "text"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for row in rows:
        writer.writerow(row)

print("CSV file 'tech_it_talking_points.csv' has been created with 100 rows!")