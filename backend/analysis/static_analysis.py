import re

def analyze_js(code: str):
    score = 0

    regex_patterns = {
        r"eval\s*\(": 3,
        r"Function\s*\(": 3,
        r"document\.cookie": 3,
        r"localStorage": 1,
        r"sessionStorage": 1,
        r"fetch\s*\(": 1,
        r"XMLHttpRequest": 1,
        r"atob\s*\(": 2,
        r"btoa\s*\(": 2,
        r"String\.fromCharCode": 2,
        r"window\.location": 1,
        r"setTimeout\s*\(.*\)": 1,
        r"http[s]?:\/\/": 1
    }

    for pattern, weight in regex_patterns.items():
        if re.search(pattern, code):
            score += weight

    # Obfuscation heuristic
    if len(code) > 3000:
        score += 1

    if score >= 5:
        return "malicious", score
    else:
        return "safe", score
