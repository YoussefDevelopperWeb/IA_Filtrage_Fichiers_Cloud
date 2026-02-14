import random
import csv

rows = []

for _ in range(1000):
    has_eval = random.choice([0, 1])
    has_cookie = random.choice([0, 1])
    has_fetch = random.choice([0, 1])
    has_atob = random.choice([0, 1])

    length = random.randint(100, 6000)

    # règle logique
    label = 1 if (has_eval or has_cookie or has_atob or length > 2000) else 0

    rows.append([
        has_eval,
        has_cookie,
        has_fetch,
        has_atob,
        length,
        label
    ])

with open("js_dataset.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "has_eval",
        "has_cookie",
        "has_fetch",
        "has_atob",
        "length",
        "label"
    ])
    writer.writerows(rows)

print("Dataset généré avec succès")
