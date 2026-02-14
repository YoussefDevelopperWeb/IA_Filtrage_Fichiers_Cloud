def extract_features(code: str):
    features = {}

    features["has_eval"] = int("eval(" in code)
    features["has_cookie"] = int("document.cookie" in code)
    features["has_fetch"] = int("fetch(" in code)
    features["has_atob"] = int("atob(" in code)
    features["length"] = len(code)

    return features
