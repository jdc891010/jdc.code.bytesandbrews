import csv

# Data organized into a list of dictionaries
professions = [
    # Technology & IT
    {"main_group": "Technology & IT", "secondary_label": "Software Developer", "fun_labels": "Code Conjurer"},
    {"main_group": "Technology & IT", "secondary_label": "Web Developer", "fun_labels": "Web Wizard"},
    {"main_group": "Technology & IT", "secondary_label": "Mobile App Developer", "fun_labels": "App Alchemist"},
    {"main_group": "Technology & IT", "secondary_label": "DevOps Engineer", "fun_labels": "Cloud Commander"},
    {"main_group": "Technology & IT", "secondary_label": "Systems Administrator", "fun_labels": "Server Sage"},
    {"main_group": "Technology & IT", "secondary_label": "Cybersecurity Analyst", "fun_labels": "Hack Halter"},
    {"main_group": "Technology & IT", "secondary_label": "Data Scientist", "fun_labels": "Data Dynamo"},
    {"main_group": "Technology & IT", "secondary_label": "Machine Learning Engineer", "fun_labels": "AI Architect"},
    {"main_group": "Technology & IT", "secondary_label": "IT Support Specialist", "fun_labels": "Tech Troubleshooter"},
    {"main_group": "Technology & IT", "secondary_label": "Cloud Architect", "fun_labels": "Sky Sculptor"},

    # Creative & Design
    {"main_group": "Creative & Design", "secondary_label": "Graphic Designer", "fun_labels": "Pixel Pixie"},
    {"main_group": "Creative & Design", "secondary_label": "UI/UX Designer", "fun_labels": "Interface Imp"},
    {"main_group": "Creative & Design", "secondary_label": "Illustrator", "fun_labels": "Sketch Sorcerer"},
    {"main_group": "Creative & Design", "secondary_label": "Video Editor", "fun_labels": "Frame Fiend"},
    {"main_group": "Creative & Design", "secondary_label": "Motion Graphics Designer", "fun_labels": "Motion Maestro"},
    {"main_group": "Creative & Design", "secondary_label": "3D Animator", "fun_labels": "Depth Dancer"},
    {"main_group": "Creative & Design", "secondary_label": "Photographer", "fun_labels": "Lens Luminary"},
    {"main_group": "Creative & Design", "secondary_label": "Art Director", "fun_labels": "Vision Vanguard"},
    {"main_group": "Creative & Design", "secondary_label": "Web Designer", "fun_labels": "Digital Decorator"},
    {"main_group": "Creative & Design", "secondary_label": "Game Designer", "fun_labels": "Playmaker"},

    # Writing & Content Creation
    {"main_group": "Writing & Content Creation", "secondary_label": "Copywriter", "fun_labels": "Word Weaver"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Content Writer", "fun_labels": "Story Spinner"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Technical Writer", "fun_labels": "Tech Teller"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Journalist", "fun_labels": "News Nomad"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Blogger", "fun_labels": "Blog Bard"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Editor/Proofreader", "fun_labels": "Grammar Guru"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Scriptwriter", "fun_labels": "Script Scribe"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Social Media Content Creator", "fun_labels": "Post Prodigy"},
    {"main_group": "Writing & Content Creation", "secondary_label": "SEO Specialist", "fun_labels": "Search Sage"},
    {"main_group": "Writing & Content Creation", "secondary_label": "Author", "fun_labels": "Tale Titan"},

    # Marketing & Sales
    {"main_group": "Marketing & Sales", "secondary_label": "Digital Marketer", "fun_labels": "Buzz Beast"},
    {"main_group": "Marketing & Sales", "secondary_label": "Social Media Manager", "fun_labels": "Trend Tamer"},
    {"main_group": "Marketing & Sales", "secondary_label": "Email Marketing Specialist", "fun_labels": "Inbox Instigator"},
    {"main_group": "Marketing & Sales", "secondary_label": "SEO Specialist", "fun_labels": "Rank Ranger"},
    {"main_group": "Marketing & Sales", "secondary_label": "PPC Manager", "fun_labels": "Click Captain"},
    {"main_group": "Marketing & Sales", "secondary_label": "Marketing Consultant", "fun_labels": "Strategy Star"},
    {"main_group": "Marketing & Sales", "secondary_label": "Sales Representative", "fun_labels": "Deal Driver"},
    {"main_group": "Marketing & Sales", "secondary_label": "Affiliate Marketer", "fun_labels": "Link Lord"},
    {"main_group": "Marketing & Sales", "secondary_label": "Brand Strategist", "fun_labels": "Brand Buccaneer"},
    {"main_group": "Marketing & Sales", "secondary_label": "Market Research Analyst", "fun_labels": "Insight Investigator"},

    # Business & Administration
    {"main_group": "Business & Administration", "secondary_label": "Virtual Assistant", "fun_labels": "Task Titan"},
    {"main_group": "Business & Administration", "secondary_label": "Project Manager", "fun_labels": "Plan Paladin"},
    {"main_group": "Business & Administration", "secondary_label": "Operations Manager", "fun_labels": "Ops Oracle"},
    {"main_group": "Business & Administration", "secondary_label": "Customer Support Representative", "fun_labels": "Help Hero"},
    {"main_group": "Business & Administration", "secondary_label": "HR Consultant", "fun_labels": "People Protector"},
    {"main_group": "Business & Administration", "secondary_label": "Bookkeeper", "fun_labels": "Number Ninja"},
    {"main_group": "Business & Administration", "secondary_label": "Accountant", "fun_labels": "Ledger Legend"},
    {"main_group": "Business & Administration", "secondary_label": "Business Analyst", "fun_labels": "Data Detective"},
    {"main_group": "Business & Administration", "secondary_label": "Executive Assistant", "fun_labels": "Schedule Sorcerer"},
    {"main_group": "Business & Administration", "secondary_label": "Event Planner", "fun_labels": "Virtual Visionary"},

    # Education & Training
    {"main_group": "Education & Training", "secondary_label": "Online Tutor", "fun_labels": "Knowledge Knight"},
    {"main_group": "Education & Training", "secondary_label": "E-Learning Developer", "fun_labels": "Lesson Luminary"},
    {"main_group": "Education & Training", "secondary_label": "Instructional Designer", "fun_labels": "Course Crafter"},
    {"main_group": "Education & Training", "secondary_label": "Language Teacher", "fun_labels": "Tongue Tamer"},
    {"main_group": "Education & Training", "secondary_label": "Corporate Trainer", "fun_labels": "Skill Sensei"},
    {"main_group": "Education & Training", "secondary_label": "Life Coach", "fun_labels": "Goal Guru"},
    {"main_group": "Education & Training", "secondary_label": "Fitness Instructor", "fun_labels": "Move Maestro"},
    {"main_group": "Education & Training", "secondary_label": "Career Counselor", "fun_labels": "Pathfinder"},
    {"main_group": "Education & Training", "secondary_label": "Academic Researcher", "fun_labels": "Study Sage"},
    {"main_group": "Education & Training", "secondary_label": "Course Creator", "fun_labels": "Edu Enchanter"},

    # Consulting & Freelance Expertise
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Management Consultant", "fun_labels": "Strategy Sorcerer"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Financial Advisor", "fun_labels": "Money Mage"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Legal Consultant", "fun_labels": "Law Luminary"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Translation/Interpreter", "fun_labels": "Word Wanderer"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Voice-Over Artist", "fun_labels": "Voice Virtuoso"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Podcast Producer", "fun_labels": "Audio Ace"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Sustainability Consultant", "fun_labels": "Green Guru"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Health/Wellness Coach", "fun_labels": "Wellness Warrior"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Startup Advisor", "fun_labels": "Venture Visionary"},
    {"main_group": "Consulting & Freelance Expertise", "secondary_label": "Grant Writer", "fun_labels": "Fund Finder"},

    # Media & Entertainment
    {"main_group": "Media & Entertainment", "secondary_label": "Podcaster", "fun_labels": "Mic Maestro"},
    {"main_group": "Media & Entertainment", "secondary_label": "YouTuber/Streamer", "fun_labels": "Screen Star"},
    {"main_group": "Media & Entertainment", "secondary_label": "Music Producer", "fun_labels": "Beat Brewer"},
    {"main_group": "Media & Entertainment", "secondary_label": "Audio Engineer", "fun_labels": "Sound Sculptor"},
    {"main_group": "Media & Entertainment", "secondary_label": "Film Critic", "fun_labels": "Reel Reviewer"},
    {"main_group": "Media & Entertainment", "secondary_label": "Game Tester", "fun_labels": "Play Paladin"},
    {"main_group": "Media & Entertainment", "secondary_label": "Digital Artist", "fun_labels": "Pixel Poet"},
    {"main_group": "Media & Entertainment", "secondary_label": "Radio Host", "fun_labels": "Wave Wrangler"},
    {"main_group": "Media & Entertainment", "secondary_label": "Sound Designer", "fun_labels": "Echo Enchanter"},
    {"main_group": "Media & Entertainment", "secondary_label": "Virtual Event Host", "fun_labels": "Stream Sage"},
]

# Write to CSV
with open("remote_work_professions.csv", "w", newline="") as csvfile:
    fieldnames = ["main_group", "secondary_label", "fun_labels"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for profession in professions:
        writer.writerow(profession)

print("CSV file 'remote_work_professions.csv' has been created!")